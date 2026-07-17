import type { Product, Category, ShippingMethod } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Face and skin care products',
    parent_id: null,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-makeup',
    name: 'Makeup',
    slug: 'makeup',
    description: 'Professional makeup products',
    parent_id: null,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-body-care',
    name: 'Body Care',
    slug: 'body-care',
    description: 'Body lotions and moisturizers',
    parent_id: null,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-hair-care',
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Hair oils and treatments',
    parent_id: null,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-fragrance',
    name: 'Fragrance',
    slug: 'fragrance',
    description: 'Perfumes and fragrances',
    parent_id: null,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-spf50',
    name: 'Rose City Daily Defence SPF50',
    slug: 'rose-city-daily-defence-spf50',
    description: 'Broad-spectrum SPF50 sunscreen that protects against harsh African sun. Lightweight, non-comedogenic formula with aloe vera.',
    price: 219.00,
    compare_at_price: null,
    type: 'physical',
    category_id: 'cat-skincare',
    sku: 'SPF50-001',
    stock_quantity: 50,
    is_active: true,
    is_featured: true,
    digital_file_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'cat-skincare', name: 'Skincare', slug: 'skincare', description: '', parent_id: null, image_url: null, is_active: true, created_at: new Date().toISOString() },
    images: [
      { id: 'img-spf50', product_id: 'prod-spf50', url: '/sunscreen-300x300.jpg', alt_text: 'Rose City Daily Defence SPF50', position: 0, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 'prod-brush',
    name: 'Rose City Professional Makeup Brush Set',
    slug: 'rose-city-professional-makeup-brush-set',
    description: 'Complete professional makeup brush set. Premium synthetic bristles for flawless application.',
    price: 349.00,
    compare_at_price: null,
    type: 'physical',
    category_id: 'cat-makeup',
    sku: 'BRUSH-001',
    stock_quantity: 30,
    is_active: true,
    is_featured: true,
    digital_file_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'cat-makeup', name: 'Makeup', slug: 'makeup', description: '', parent_id: null, image_url: null, is_active: true, created_at: new Date().toISOString() },
    images: [
      { id: 'img-brush', product_id: 'prod-brush', url: '/makeup-brush2-300x300.jpg', alt_text: 'Rose City Professional Makeup Brush Set', position: 0, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 'prod-lotion',
    name: 'Rose City Shea Body Lotion',
    slug: 'rose-city-shea-body-lotion',
    description: 'Rich, nourishing shea body lotion for deep hydration. Leaves skin feeling soft and smooth all day.',
    price: 159.00,
    compare_at_price: null,
    type: 'physical',
    category_id: 'cat-body-care',
    sku: 'LOTION-001',
    stock_quantity: 40,
    is_active: true,
    is_featured: true,
    digital_file_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'cat-body-care', name: 'Body Care', slug: 'body-care', description: '', parent_id: null, image_url: null, is_active: true, created_at: new Date().toISOString() },
    images: [
      { id: 'img-lotion', product_id: 'prod-lotion', url: '/body-lotion-300x300.jpg', alt_text: 'Rose City Shea Body Lotion', position: 0, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 'prod-serum',
    name: 'Rose City Hyaluronic Acid Serum',
    slug: 'rose-city-hyaluronic-acid-serum',
    description: 'Advanced hyaluronic acid serum for intense hydration. Plumps and smooths for a youthful glow.',
    price: 299.00,
    compare_at_price: null,
    type: 'physical',
    category_id: 'cat-skincare',
    sku: 'SERUM-001',
    stock_quantity: 35,
    is_active: true,
    is_featured: true,
    digital_file_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'cat-skincare', name: 'Skincare', slug: 'skincare', description: '', parent_id: null, image_url: null, is_active: true, created_at: new Date().toISOString() },
    images: [
      { id: 'img-serum', product_id: 'prod-serum', url: '/face-serum-300x300.jpg', alt_text: 'Rose City Hyaluronic Acid Serum', position: 0, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 'prod-hair-oil',
    name: 'Rose City Argan Hair Oil',
    slug: 'rose-city-argan-hair-oil',
    description: 'Pure argan oil for silky, nourished hair. Restores shine and reduces frizz for all hair types.',
    price: 189.00,
    compare_at_price: null,
    type: 'physical',
    category_id: 'cat-hair-care',
    sku: 'HAIR-001',
    stock_quantity: 45,
    is_active: true,
    is_featured: true,
    digital_file_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'cat-hair-care', name: 'Hair Care', slug: 'hair-care', description: '', parent_id: null, image_url: null, is_active: true, created_at: new Date().toISOString() },
    images: [
      { id: 'img-hair-oil', product_id: 'prod-hair-oil', url: '/hair-oil-300x300.jpg', alt_text: 'Rose City Argan Hair Oil', position: 0, created_at: new Date().toISOString() },
    ],
  },
  {
    id: 'prod-perfume',
    name: 'Rose City Eau de Parfum – Free State Bloom',
    slug: 'rose-city-eau-de-parfum-free-state-bloom',
    description: 'A captivating floral fragrance inspired by the Free State landscape. Notes of freesia, jasmine, and rose.',
    price: 399.00,
    compare_at_price: null,
    type: 'physical',
    category_id: 'cat-fragrance',
    sku: 'PERFUME-001',
    stock_quantity: 20,
    is_active: true,
    is_featured: true,
    digital_file_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'cat-fragrance', name: 'Fragrance', slug: 'fragrance', description: '', parent_id: null, image_url: null, is_active: true, created_at: new Date().toISOString() },
    images: [
      { id: 'img-perfume', product_id: 'prod-perfume', url: '/perfume-300x300.jpg', alt_text: 'Rose City Eau de Parfum – Free State Bloom', position: 0, created_at: new Date().toISOString() },
    ],
  },
];

export const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'ship-1',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 5.99,
    estimated_days_min: 5,
    estimated_days_max: 7,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ship-2',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 12.99,
    estimated_days_min: 2,
    estimated_days_max: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ship-3',
    name: 'Next Day Delivery',
    description: 'Delivery by next business day',
    price: 19.99,
    estimated_days_min: 1,
    estimated_days_max: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export function isDemoMode(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const isValidSupabaseUrl = url.startsWith('https://') && url.includes('.supabase.co');
  return !isValidSupabaseUrl;
}

export function getMockProduct(slug: string): Product | null {
  return mockProducts.find(p => p.slug === slug) || null;
}

export function getMockFeaturedProducts(): Product[] {
  return mockProducts.filter(p => p.is_featured);
}

export function getMockProductsByCategory(categorySlug: string): Product[] {
  const category = mockCategories.find(c => c.slug === categorySlug);
  if (!category) return mockProducts;
  return mockProducts.filter(p => p.category_id === category.id);
}
