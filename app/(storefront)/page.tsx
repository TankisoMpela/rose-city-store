'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { useDemoProductsStore } from '@/lib/store/demo-products';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const products = useDemoProductsStore((state) => state.products);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeProducts = products.filter(p => p.is_active);
  const featured = activeProducts.slice(0, 6);
  const bestSellers = activeProducts.slice(0, 3);

  const AddToCartProductButton = ({ product }: { product: Product }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState(false);
    const isOutOfStock = product.stock_quantity < 1;

    const handleAdd = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock) return;
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    };

    const handlePayNow = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock) return;
      addItem(product);
      router.push('/checkout');
    };

    return (
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`
            py-2 px-5 text-[13px] font-normal uppercase tracking-wider transition-all duration-200 border rounded-none cursor-pointer
            ${isOutOfStock
              ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
              : added
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-transparent text-accent border-accent hover:bg-accent/10'
            }
          `}
        >
          {isOutOfStock ? 'Sold Out' : added ? 'Added!' : 'Add to Cart'}
        </button>
        {!isOutOfStock && (
          <button
            onClick={handlePayNow}
            className="py-2 px-5 text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 border border-accent bg-accent text-white hover:bg-deep-contrast hover:border-deep-contrast cursor-pointer"
          >
            Pay Now
          </button>
        )}
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-8 p-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="border-[38px] border-white bg-white">
            <div className="flex flex-col md:flex-row items-center gap-8 pl-12 pr-0 bg-[#f5f0fa] overflow-hidden">
              <div className="flex-1 pb-12 pt-12 md:pt-0">
                <h1 className="text-5xl md:text-7xl font-bold text-accent leading-tight mb-0">ROSE CITY</h1>
                <h1 className="text-5xl md:text-7xl font-light text-accent leading-tight mb-4">BEAUTY</h1>
                <p className="text-accent text-lg font-light leading-relaxed mb-8 max-w-md">
                  Bloemfontein&apos;s premier destination for skincare, makeup, and self-care. Quality beauty products, proudly South African.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-accent text-white px-8 py-3 text-xs font-semibold tracking-wider uppercase hover:bg-deep-contrast transition-colors rounded-none"
                >
                  Shop Now
                </Link>
              </div>
              <div className="flex-1 self-end">
                <img
                  src="/African-Woman-1024x683.png"
                  alt="Rose City Beauty"
                  className="w-full h-auto object-cover object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface pb-0">
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Promo Card 1 */}
              <div className="bg-promo-pink grid grid-cols-[195px_1fr] gap-[10px] items-center min-h-[195px] p-0 overflow-hidden">
                <div className="h-full w-full m-0">
                  <img src="/hero-accent-1.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="py-[30px] pr-[30px] pl-0 flex flex-col justify-center">
                  <p className="text-[12px] font-semibold tracking-[1px] uppercase text-deep-contrast/70 m-0">New makeup</p>
                  <p className="text-[20px] font-bold uppercase text-deep-contrast mt-0 mb-3 leading-[1.6]">Arrivals</p>
                  <div className="flex">
                    <Link
                      href="/products"
                      className="bg-deep-contrast text-white px-6 py-3 text-[12px] font-semibold tracking-[1px] uppercase hover:bg-accent transition-colors rounded-none"
                    >
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Promo Card 2 */}
              <div className="bg-promo-mint grid grid-cols-[195px_1fr] gap-[10px] items-center min-h-[195px] p-0 overflow-hidden">
                <div className="h-full w-full m-0">
                  <img src="/hero-accent-2.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="py-[30px] pr-[30px] pl-0 flex flex-col justify-center">
                  <p className="text-[12px] font-semibold tracking-[1px] uppercase text-deep-contrast/70 m-0">Products</p>
                  <p className="text-[20px] font-bold uppercase text-deep-contrast mt-0 mb-3 leading-[1.6]">Discounts</p>
                  <div className="flex">
                    <Link
                      href="/products"
                      className="bg-deep-contrast text-white px-6 py-3 text-[12px] font-semibold tracking-[1px] uppercase hover:bg-accent transition-colors rounded-none"
                    >
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Promo Card 3 */}
              <div className="bg-promo-lavender grid grid-cols-[195px_1fr] gap-[10px] items-center min-h-[195px] p-0 overflow-hidden">
                <div className="h-full w-full m-0">
                  <img src="/hero-accent-3.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="py-[30px] pr-[30px] pl-0 flex flex-col justify-center">
                  <p className="text-[12px] font-semibold tracking-[1px] uppercase text-deep-contrast/70 m-0">Face masks</p>
                  <p className="text-[20px] font-bold uppercase text-deep-contrast mt-0 mb-3 leading-[1.6]">Skin care</p>
                  <div className="flex">
                    <Link
                      href="/products"
                      className="bg-deep-contrast text-white px-6 py-3 text-[12px] font-semibold tracking-[1px] uppercase hover:bg-accent transition-colors rounded-none"
                    >
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white p-6 md:p-8">
            <div className="text-center mb-10">
              <h3 className="text-[40px] font-bold text-accent uppercase tracking-wide leading-[1.25] m-0">Featured</h3>
              <h4 className="text-[22.4px] font-light text-deep-contrast uppercase tracking-wide leading-[1.6] mt-0">Products</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((product) => (
                <article key={product.id} className="bg-white pb-4 flex flex-col items-start text-left">
                  <Link href={`/product/${product.slug}`} className="w-full">
                    <div className="aspect-square bg-[#f8f8f8] border border-[#f6f6f6] w-full flex items-center justify-center mb-4 overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <h4 className="text-[22.4px] font-light text-left mt-0 mb-2 leading-tight">
                    <Link href={`/product/${product.slug}`} className="text-deep-contrast hover:text-accent transition-colors no-underline">
                      {product.name}
                    </Link>
                  </h4>
                  <span className="text-[16px] font-normal text-accent mb-4 block">
                    {formatPrice(product.price)}
                  </span>
                  <AddToCartProductButton product={product} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="bg-white px-4 py-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative aspect-video overflow-hidden">
              <img src="/band-1.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#ba7aa5]/60" />
              <div className="absolute inset-0 flex flex-col items-end justify-center p-8 text-white">
                <h4 className="text-[32px] font-light uppercase leading-[1.1] text-right m-0">
                  <strong>Natural</strong><br />Products
                </h4>
                <Link href="/products" className="text-[14px] font-normal uppercase tracking-[1px] mt-4 hover:text-accent transition-colors underline underline-offset-4">
                  Discover now
                </Link>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden">
              <img src="/band-2.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#9b9695]/60" />
              <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-white">
                <h4 className="text-[32px] font-light uppercase leading-[1.1] text-left m-0">
                  <strong>Spring</strong><br />Tones
                </h4>
                <Link href="/products" className="text-[14px] font-normal uppercase tracking-[1px] mt-4 hover:text-accent transition-colors underline underline-offset-4">
                  See collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white p-6 md:p-8">
            <div className="text-center mb-10">
              <h3 className="text-[40px] font-bold text-accent uppercase tracking-wide leading-[1.25] m-0">Best</h3>
              <h4 className="text-[22.4px] font-light text-deep-contrast uppercase tracking-wide leading-[1.6] mt-0">Selling</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bestSellers.map((product) => (
                <article key={product.id} className="bg-white pb-4 flex flex-col items-start text-left">
                  <Link href={`/product/${product.slug}`} className="w-full">
                    <div className="aspect-square bg-[#f8f8f8] border border-[#f6f6f6] w-full flex items-center justify-center mb-4 overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <h4 className="text-[22.4px] font-light text-left mt-0 mb-2 leading-tight">
                    <Link href={`/product/${product.slug}`} className="text-deep-contrast hover:text-accent transition-colors no-underline">
                      {product.name}
                    </Link>
                  </h4>
                  <span className="text-[16px] font-normal text-accent mb-4 block">
                    {formatPrice(product.price)}
                  </span>
                  <AddToCartProductButton product={product} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
