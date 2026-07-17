'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';

interface Props {
  product: Product;
  variants: ProductVariant[];
}

export default function ProductVariantSelectorMinimal({ product, variants }: Props) {
  const router = useRouter();
  const activeVariants = variants.filter((v) => v.is_active);
  const hasVariants = activeVariants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? activeVariants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const currentStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant || undefined, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handlePayNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant || undefined, quantity);
    router.push('/checkout');
  };

  return (
    <div className="space-y-4">
      {/* Variant Selector */}
      {hasVariants && (
        <div>
          <label className="block text-sm text-gray-600 mb-2">Variant</label>
          <div className="flex flex-wrap gap-2">
            {activeVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock_quantity === 0}
                className={`
                  px-3 py-2 text-sm rounded-none border transition-all
                  ${selectedVariant?.id === variant.id
                    ? 'border-accent bg-accent text-white'
                    : 'border-gray-200 hover:border-accent'
                  }
                  ${variant.stock_quantity === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}
                `}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <div className="flex items-center border border-accent rounded-none justify-between sm:justify-start w-full sm:w-auto">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-accent hover:bg-accent-soft/20 text-lg"
          >
            -
          </button>
          <span className="w-12 text-center text-sm font-medium text-deep-contrast">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="w-12 h-12 flex items-center justify-center text-accent hover:bg-accent-soft/20 text-lg"
          >
            +
          </button>
        </div>

        <div className="flex flex-1 gap-2 w-full">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`
              flex-1 py-3 px-4 rounded-none font-semibold text-sm uppercase tracking-wider transition-all border
              ${added
                ? 'bg-green-500 border-green-500 text-white'
                : isOutOfStock
                  ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-transparent border-accent text-accent hover:bg-accent/10'
              }
            `}
          >
            {added ? 'Added!' : isOutOfStock ? 'Sold out' : 'Add to cart'}
          </button>

          {!isOutOfStock && (
            <button
              onClick={handlePayNow}
              className="flex-1 py-3 px-4 rounded-none font-semibold text-sm uppercase tracking-wider transition-all border border-accent bg-accent text-white hover:bg-deep-contrast hover:border-deep-contrast"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>

      {/* Low stock warning */}
      {currentStock > 0 && currentStock <= 5 && (
        <p className="text-sm text-amber-600">
          Only {currentStock} left
        </p>
      )}
    </div>
  );
}
