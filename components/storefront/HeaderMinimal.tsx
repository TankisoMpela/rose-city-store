'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { useDemoProductsStore } from '@/lib/store/demo-products';

export default function HeaderMinimal() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const categories = useDemoProductsStore((state) => state.categories);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header>
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-between text-xs md:text-sm text-accent">
            <div className="flex items-center gap-4">
              <a href="mailto:hello@rosecitybeauty.co.za" className="hover:text-deep-contrast transition-colors">hello@rosecitybeauty.co.za</a>
              <span className="text-gray-200">|</span>
              <a href="tel:+27511234567" className="hover:text-deep-contrast transition-colors">+27 51 123 4567</a>
            </div>
            <div className="flex items-center gap-2">
              {/* Facebook */}
              <a href="#" className="w-6 h-6 rounded-full bg-accent hover:bg-deep-contrast text-white flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              {/* X */}
              <a href="#" className="w-6 h-6 rounded-full bg-accent hover:bg-deep-contrast text-white flex items-center justify-center transition-colors" aria-label="X">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-6 h-6 rounded-full bg-accent hover:bg-deep-contrast text-white flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-6 h-6 rounded-full bg-accent hover:bg-deep-contrast text-white flex items-center justify-center transition-colors" aria-label="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 md:hidden"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="flex items-center">
              <img src="/Rose-City-Beauty.png" alt="Rose City Beauty" className="h-[52px] w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center gap-8 flex-1 justify-end">
              <Link href="/" className="text-[16px] text-accent font-normal hover:text-deep-contrast transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-[16px] text-accent font-normal hover:text-deep-contrast transition-colors">
                Shop
              </Link>
              <Link href="/cart" className="text-[16px] text-accent font-normal hover:text-deep-contrast transition-colors">
                Cart
              </Link>
              <Link href="/checkout" className="text-[16px] text-accent font-normal hover:text-deep-contrast transition-colors">
                Checkout
              </Link>
              <Link href="/account" className="text-[16px] text-accent font-normal hover:text-deep-contrast transition-colors">
                My Account
              </Link>
            </nav>

            <div className="flex items-center gap-1 md:hidden">
              <Link
                href="/cart"
                className="relative p-2 hover:bg-accent-soft/30 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
              <span className="font-semibold text-accent tracking-[2px] uppercase text-sm">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 -mr-2" aria-label="Close menu">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4">
              <div className="space-y-1">
                <Link href="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-accent rounded-lg hover:bg-surface">
                  Home
                </Link>
                <Link href="/products" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-accent rounded-lg hover:bg-surface">
                  Shop
                </Link>
                <Link href="/cart" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-accent rounded-lg hover:bg-surface">
                  Cart
                </Link>
                <Link href="/checkout" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-accent rounded-lg hover:bg-surface">
                  Checkout
                </Link>
                <Link href="/account" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-accent rounded-lg hover:bg-surface">
                  My Account
                </Link>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="px-3 text-xs font-medium text-accent uppercase tracking-wider mb-2">Categories</p>
                <div className="space-y-1">
                  {mounted && categories.map((cat) => (
                    <Link key={cat.id} href={`/products?category=${cat.slug}`} onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-muted-contrast rounded-lg hover:bg-surface">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
