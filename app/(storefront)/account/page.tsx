'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
}

interface UserAddress {
  id?: string;
  address_line1: string;
  city: string;
  postal_code: string;
  phone: string;
}

interface DBOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  created_at: string;
}

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'address' | 'orders'>('overview');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Database States
  const [profile, setProfile] = useState<UserProfile>({ full_name: '', email: '', phone: '' });
  const [address, setAddress] = useState<UserAddress>({ address_line1: '', city: '', postal_code: '', phone: '' });
  const [orders, setOrders] = useState<DBOrder[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Fetch Profile
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single();

      if (dbProfile) {
        setProfile({
          full_name: dbProfile.full_name || '',
          email: dbProfile.email || user.email || '',
          phone: dbProfile.phone || '',
        });
      } else {
        setProfile({
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || '',
          phone: '',
        });
      }

      // 2. Fetch default address
      const { data: dbAddress } = await supabase
        .from('addresses')
        .select('id, address_line1, city, postal_code, phone')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle();

      if (dbAddress) {
        setAddress({
          id: dbAddress.id,
          address_line1: dbAddress.address_line1 || '',
          city: dbAddress.city || '',
          postal_code: dbAddress.postal_code || '',
          phone: dbAddress.phone || '',
        });
      }

      // 3. Fetch orders
      const { data: dbOrders } = await supabase
        .from('orders')
        .select('id, order_number, status, payment_status, payment_method, total, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dbOrders) {
        setOrders(dbOrders);
      }
    } catch (e) {
      console.error('Error loading account data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) throw new Error('Not authenticated');

      const addressData = {
        user_id: user.id,
        full_name: profile.full_name || 'Customer Address',
        address_line1: address.address_line1,
        city: address.city,
        postal_code: address.postal_code,
        country: 'South Africa',
        phone: address.phone,
        is_default: true,
      };

      if (address.id) {
        const { error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', address.id);
        if (error) throw error;
      } else {
        const { data: newAddr, error } = await supabase
          .from('addresses')
          .insert(addressData)
          .select('id')
          .single();
        if (error) throw error;
        if (newAddr) setAddress((prev) => ({ ...prev, id: newAddr.id }));
      }

      setMessage({ type: 'success', text: 'Shipping address updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save shipping address' });
    } finally {
      setSaveLoading(false);
    }
  };

  if (!mounted) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500 font-light">
        Loading your account...
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 min-h-[60vh]">
      {/* Welcome Card banner */}
      <div className="mb-10 bg-white border border-accent/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <h1 className="text-xl font-light uppercase tracking-widest text-[#2d1f33]">
            My Account
          </h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            Logged in as <span className="font-semibold text-accent">{profile.email}</span>
          </p>
        </div>
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/login';
          }}
          className="text-xs uppercase tracking-wider py-2 px-4 border border-accent/40 text-accent hover:bg-accent hover:text-white transition-all duration-200"
        >
          Sign Out
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 text-sm border rounded-none ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Navigation Sidebar Tabs */}
        <nav className="w-full md:w-64 flex flex-col border border-accent/20 bg-white p-3 shrink-0">
          {[
            { id: 'overview', name: 'Dashboard Overview' },
            { id: 'profile', name: 'Edit Profile' },
            { id: 'address', name: 'Shipping Address' },
            { id: 'orders', name: 'Order History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setMessage(null);
              }}
              className={`text-left px-4 py-3 text-xs uppercase tracking-wider transition-all duration-200 border-l-2 ${
                activeTab === tab.id
                  ? 'border-accent bg-accent-soft/10 text-accent font-semibold'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-[#2d1f33]'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white border border-accent/20 p-6 md:p-8 min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-500 font-light text-sm">
              Loading dashboard details...
            </div>
          ) : (
            <>
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h2 className="text-lg font-light text-[#2d1f33] uppercase tracking-wide">
                      Welcome, {profile.full_name || 'Valued Customer'}
                    </h2>
                    <p className="text-sm text-gray-500 font-light mt-1">
                      From your dashboard, you can manage your shipping info, check your order history, and edit your profile settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stats Box */}
                    <div className="border border-accent/10 p-5 bg-[#F9F7FB]">
                      <h3 className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">
                        Purchases Summary
                      </h3>
                      <p className="text-3xl font-light text-[#2d1f33] mt-2">
                        {orders.length} <span className="text-sm text-gray-500 font-normal">orders placed</span>
                      </p>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-[11px] uppercase tracking-wider text-accent hover:underline mt-4 block"
                      >
                        View Order History &rarr;
                      </button>
                    </div>

                    {/* Address Preview Box */}
                    <div className="border border-accent/10 p-5 bg-[#F9F7FB]">
                      <h3 className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">
                        Default Shipping Address
                      </h3>
                      {address.address_line1 ? (
                        <div className="text-sm text-gray-600 font-light mt-2 space-y-1">
                          <p>{address.address_line1}</p>
                          <p>{address.city}, {address.postal_code}</p>
                          <p className="text-xs text-gray-400">Phone: {address.phone}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 font-light mt-2 italic">
                          No default address saved yet.
                        </p>
                      )}
                      <button
                        onClick={() => setActiveTab('address')}
                        className="text-[11px] uppercase tracking-wider text-accent hover:underline mt-4 block"
                      >
                        Manage Address &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Edit Profile */}
              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base font-medium text-gray-900 uppercase tracking-wider">
                      Profile Information
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Update your account contact details.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-accent/20 rounded-none text-sm focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Email Address (Read-only)
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-100 bg-gray-50 rounded-none text-sm text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="e.g. +27 51 123 4567"
                        className="w-full px-3 py-2 border border-accent/20 rounded-none text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="py-2.5 px-6 bg-accent text-white uppercase tracking-wider font-semibold text-xs rounded-none hover:bg-deep-contrast transition-all duration-200"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {/* Tab 3: Shipping Address */}
              {activeTab === 'address' && (
                <form onSubmit={handleUpdateAddress} className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base font-medium text-gray-900 uppercase tracking-wider">
                      Shipping Details
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Set a default address to auto-fill future checkout forms.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={address.address_line1}
                        onChange={(e) => setAddress({ ...address, address_line1: e.target.value })}
                        required
                        placeholder="e.g. 21 President Street"
                        className="w-full px-3 py-2 border border-accent/20 rounded-none text-sm focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          required
                          placeholder="e.g. Bloemfontein"
                          className="w-full px-3 py-2 border border-accent/20 rounded-none text-sm focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={address.postal_code}
                          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                          required
                          placeholder="e.g. 9301"
                          className="w-full px-3 py-2 border border-accent/20 rounded-none text-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                        Delivery Contact Phone
                      </label>
                      <input
                        type="text"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        required
                        placeholder="e.g. +27 51 123 4567"
                        className="w-full px-3 py-2 border border-accent/20 rounded-none text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="py-2.5 px-6 bg-accent text-white uppercase tracking-wider font-semibold text-xs rounded-none hover:bg-deep-contrast transition-all duration-200"
                  >
                    {saveLoading ? 'Saving Address...' : 'Save Shipping Address'}
                  </button>
                </form>
              )}

              {/* Tab 4: Order History */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base font-medium text-gray-900 uppercase tracking-wider">
                      Your Orders
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Click an order number to view complete summary receipts.
                    </p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-200">
                      <p className="text-gray-400 font-light text-sm mb-4">
                        You have not placed any orders yet.
                      </p>
                      <Link
                        href="/products"
                        className="inline-block py-2.5 px-6 border border-accent bg-transparent text-accent uppercase tracking-wider text-xs font-semibold hover:bg-accent hover:text-white transition-all duration-200"
                      >
                        Start Shopping
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
                            <th className="py-3 px-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          {orders.map((ord) => (
                            <tr key={ord.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="py-4 px-2">
                                <Link
                                  href={`/checkout/success?orderId=${ord.id}`}
                                  className="font-bold text-accent hover:text-deep-contrast hover:underline"
                                >
                                  {ord.order_number}
                                </Link>
                              </td>
                              <td className="py-4 px-2 font-light">
                                {new Date(ord.created_at).toLocaleDateString('en-ZA', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                              <td className="py-4 px-2">
                                <span className={`px-2 py-0.5 text-[9px] font-semibold border ${
                                  ord.status === 'processing'
                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                    : ord.status === 'delivered'
                                      ? 'bg-green-50 border-green-200 text-green-700'
                                      : 'bg-amber-50 border-amber-200 text-amber-700'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-4 px-2">
                                <span className="font-light text-gray-400 block text-[10px]">
                                  {ord.payment_method}
                                </span>
                                <span className={`text-[9px] font-semibold ${
                                  ord.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'
                                }`}>
                                  {ord.payment_status}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-right font-semibold text-gray-900">
                                {formatPrice(ord.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
