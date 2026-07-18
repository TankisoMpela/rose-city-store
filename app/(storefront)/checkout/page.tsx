'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { items, getSubtotal, clearCart } = useCartStore();

  const [form, setForm] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    payment: 'paypal',
  });

  const [autofilled, setAutofilled] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auto-fill checkout form from logged-in user's profile and last order
    const prefillFromUser = async () => {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;

        // Start with name + email from Google/Supabase profile
        const prefill: Partial<typeof form> = {
          email: user.email ?? '',
          name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? '',
        };

        // Try to load address details from default address in addresses table
        const { data: defaultAddr } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .maybeSingle();

        if (defaultAddr) {
          prefill.phone = defaultAddr.phone ?? '';
          prefill.address = defaultAddr.address_line1 ?? '';
          prefill.city = defaultAddr.city ?? '';
          prefill.zip = defaultAddr.postal_code ?? '';
        } else {
          // Fallback to loading address details from the most recent completed order
          const { data: lastOrder } = await supabase
            .from('orders')
            .select('notes, customer_email')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (lastOrder?.notes) {
            // Parse saved guest details from order notes
            const phoneMatch = lastOrder.notes.match(/Phone:\s*(.+)/);
            const addressMatch = lastOrder.notes.match(/Address:\s*(.+)/);
            const cityMatch = lastOrder.notes.match(/City:\s*(.+)/);
            const zipMatch = lastOrder.notes.match(/Zip:\s*(.+)/);

            if (phoneMatch) prefill.phone = phoneMatch[1].trim();
            if (addressMatch) prefill.address = addressMatch[1].trim();
            if (cityMatch) prefill.city = cityMatch[1].trim();
            if (zipMatch) prefill.zip = zipMatch[1].trim();
          }
        }

        setForm((prev) => ({ ...prev, ...prefill }));
        if (Object.keys(prefill).some((k) => prefill[k as keyof typeof prefill])) {
          setAutofilled(true);
        }
      } catch (e) {
        // Silently fail — form stays blank for guests
      }
    };

    prefillFromUser();
  }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const codFee = form.payment === 'cod' ? 49.54 : 0;
  const total = subtotal + shipping + codFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      // 1. Insert order with guest details in notes
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: `RC-${Date.now().toString().slice(-8)}`,
          status: 'pending',
          payment_status: 'pending',
          payment_method: form.payment,
          subtotal,
          shipping_cost: shipping,
          tax: 0,
          total,
          notes: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || ''}\nAddress: ${form.address}, ${form.city} ${form.zip}`,
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error(orderError?.message || 'Failed to create database order');
      }

      // If logged in, save/update shipping address in addresses table
      if (user) {
        try {
          const { data: existingAddr } = await supabase
            .from('addresses')
            .select('id')
            .eq('user_id', user.id)
            .eq('is_default', true)
            .maybeSingle();

          const addressData = {
            user_id: user.id,
            full_name: form.name,
            address_line1: form.address,
            city: form.city,
            postal_code: form.zip,
            country: 'South Africa',
            phone: form.phone,
            is_default: true,
          };

          if (existingAddr) {
            await supabase
              .from('addresses')
              .update(addressData)
              .eq('id', existingAddr.id);
          } else {
            await supabase
              .from('addresses')
              .insert(addressData);
          }

          // Also save phone number to profile if they don't have one
          const { data: profile } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', user.id)
            .single();
          if (profile && !profile.phone && form.phone) {
            await supabase
              .from('profiles')
              .update({ phone: form.phone })
              .eq('id', user.id);
          }
        } catch (addrErr) {
          console.error('Failed to save default address:', addrErr);
          // Don't crash checkout if address saving fails
        }
      }

      // Map mock string IDs to database UUIDs
      const productIdMap: Record<string, string> = {
        'prod-spf50': '20000000-0000-0000-0000-000000000001',
        'prod-brush': '20000000-0000-0000-0000-000000000002',
        'prod-lotion': '20000000-0000-0000-0000-000000000003',
        'prod-serum': '20000000-0000-0000-0000-000000000004',
        'prod-hair': '20000000-0000-0000-0000-000000000005',
        'prod-perfume': '20000000-0000-0000-0000-000000000006',
      };

      // 2. Insert order items
      const orderItems = items.map((item) => {
        const dbProductId = productIdMap[item.product.id] || item.product.id;
        return {
          order_id: order.id,
          product_id: dbProductId,
          variant_id: item.variant?.id || null,
          quantity: item.quantity,
          unit_price: item.variant?.price ?? item.product.price,
          total_price: (item.variant?.price ?? item.product.price) * item.quantity,
          product_name: item.product.name,
          variant_name: item.variant?.name || null,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(itemsError.message || 'Failed to create order items');
      }

      // 3. Complete checkout or redirect
      if (form.payment === 'paypal') {
        router.push(`/checkout/paypal?orderId=${order.id}`);
      } else if (form.payment === 'stripe') {
        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        });
        const session = await res.json();
        if (session.url) {
          router.push(session.url);
        } else {
          throw new Error(session.error || 'Failed to create Stripe checkout session');
        }
      } else if (form.payment === 'cod') {
        // COD updates order to processing status
        await supabase
          .from('orders')
          .update({ status: 'processing' })
          .eq('id', order.id);

        clearCart();
        router.push(`/checkout/success?orderId=${order.id}`);
      }
    } catch (err: any) {
      console.error('Checkout database error:', err);
      alert(err.message || 'An error occurred during checkout');
      setLoading(false);
    }
  };

  const isValid = form.email && form.name && form.address && form.city && form.zip;

  if (!mounted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Checkout</h1>

      {autofilled && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Your details have been auto-filled from your account. Please review before completing your order.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact */}
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Contact</h2>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          />
        </section>

        {/* Shipping */}
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Shipping</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
              <input
                type="text"
                placeholder="ZIP code"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Payment</h2>
          <div className="space-y-2">
            {[
              { id: 'paypal', label: 'PayPal' },
              { id: 'cod', label: 'Cash on delivery (+ R49.54)' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  form.payment === opt.id ? 'border-black bg-gray-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.id}
                  checked={form.payment === opt.id}
                  onChange={(e) => setForm({ ...form, payment: e.target.value })}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  form.payment === opt.id ? 'border-black' : 'border-gray-300'
                }`}>
                  {form.payment === opt.id && <span className="w-2 h-2 bg-black rounded-full" />}
                </span>
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Summary</h2>

          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.name} x {item.quantity}
                </span>
                <span>{formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-sm border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            {form.payment === 'cod' && (
              <div className="flex justify-between">
                <span className="text-gray-500">COD fee</span>
                <span>{formatPrice(49.54)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between font-semibold text-lg mt-3 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
            isValid && !loading
              ? 'bg-black text-white hover:bg-gray-800 active:scale-[0.99]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : 'Complete order'}
        </button>

        <p className="text-xs text-center text-gray-400">
          By clicking "Complete order" you agree to our terms and conditions
        </p>
      </form>
    </main>
  );
}
