'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';

interface DBOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  created_at: string;
  items?: any[];
}

export default function AccountOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<DBOrder[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchOrders = async () => {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from('orders')
          .select('id, order_number, status, payment_status, payment_method, total, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setOrders(data);
        }
      } catch (e) {
        console.error('Error fetching database orders:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (!mounted) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500 font-light text-sm">Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/account" className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-700">
          &larr; Back to Account
        </Link>
        <h1 className="text-2xl font-light text-gray-900 mt-2 uppercase tracking-wide">My Orders</h1>
      </div>

      <div className="bg-white border border-accent/20 overflow-hidden shadow-sm p-4 md:p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-light text-sm">
            Loading order records...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 font-light text-sm mb-4">You haven't placed any orders yet</p>
            <Link
              href="/products"
              className="inline-block py-2.5 px-6 border border-accent bg-accent text-white uppercase tracking-wider text-xs font-semibold hover:bg-deep-contrast transition-all duration-200"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-wider">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-normal">
                  <th className="py-3 px-2">Order #</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Payment</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-2">
                      <Link
                        href={`/checkout/success?orderId=${order.id}`}
                        className="font-bold text-accent hover:text-deep-contrast hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-4 px-2 font-light">
                      {new Date(order.created_at).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 text-[9px] font-semibold border ${
                        order.status === 'processing'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : order.status === 'delivered'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="font-light text-gray-400 block text-[10px]">
                        {order.payment_method}
                      </span>
                      <span className={`text-[9px] font-semibold ${
                        order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
