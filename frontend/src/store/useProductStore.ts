import { create } from 'zustand';
import { Product } from '../types';
import { api } from '../services/api';
import { INITIAL_SEED_PRODUCTS } from '../data/seedProducts';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  isRefreshing: boolean;
  lastFetched: number;
  error: string | null;
  fetchProducts: (force?: boolean) => Promise<void>;
  getProductsByCategory: (categorySlug: string) => Product[];
  getFlashSaleProducts: () => Product[];
  getCategoryCounts: () => Record<string, number>;
}

// Synchronous Instant Hydration from Local Storage
const getInitialProducts = (): Product[] => {
  if (typeof window === 'undefined') return INITIAL_SEED_PRODUCTS;
  try {
    const cached = localStorage.getItem('shopx_cached_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fall back to seed products
  }
  return INITIAL_SEED_PRODUCTS;
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: getInitialProducts(),
  isLoading: false, // Immediately false because products are hydrated instantly!
  isRefreshing: false,
  lastFetched: 0,
  error: null,

  fetchProducts: async (force = false) => {
    const { products, lastFetched, isRefreshing } = get();

    // Cache TTL: 2 minutes (120,000ms)
    const isFresh = products.length > 0 && Date.now() - lastFetched < 120000;
    if (isFresh && !force) {
      return;
    }

    if (isRefreshing) return;

    set({ isRefreshing: true, error: null });

    try {
      const res = await api.get('/products?limit=60');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const fetchedProducts = res.data.data;
        set({
          products: fetchedProducts,
          lastFetched: Date.now(),
          isRefreshing: false,
          isLoading: false,
        });

        // Persist to local storage for subsequent 0ms instant launches
        try {
          localStorage.setItem('shopx_cached_products', JSON.stringify(fetchedProducts));
        } catch {
          // Quota exceeded safe fallback
        }
      } else {
        set({ isRefreshing: false });
      }
    } catch (err: any) {
      set({
        isRefreshing: false,
        error: err.message || 'Failed to sync latest products',
      });
    }
  },

  getProductsByCategory: (categorySlug: string) => {
    const { products } = get();
    if (!categorySlug || categorySlug === 'all') return products;
    return products.filter((p) => {
      const catSlug = typeof p.category === 'string' ? p.category : (p.category as any)?.slug;
      const slug = catSlug || p.categorySlug;
      if (categorySlug === 'gaming-consoles') {
        return slug === 'gaming-consoles' || slug === 'cameras-drones';
      }
      return slug === categorySlug;
    });
  },

  getFlashSaleProducts: () => {
    const { products } = get();
    const flash = products.filter(
      (p) => p.isFlashSale || (p.discountPrice && p.discountPrice < p.price)
    );
    return flash.length > 0 ? flash : products.slice(0, 8);
  },

  getCategoryCounts: () => {
    const { products } = get();
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const slug = p.categorySlug || (typeof p.category === 'object' ? (p.category as any)?.slug : p.category);
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      }
    });
    return counts;
  },
}));
