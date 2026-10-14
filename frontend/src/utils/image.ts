export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=70';

export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

export const DEFAULT_STORE_LOGO =
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&auto=format&fit=crop&q=80';

export const DEFAULT_STORE_BANNER =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80';

/**
 * Ensures a valid image URL is always returned.
 * Prevents React empty string ("") src warning and intercepts broken 404 image URLs.
 */
export const getSafeImage = (
  url?: string | null,
  fallback: string = DEFAULT_PRODUCT_IMAGE
): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }
  const trimmed = url.trim();
  // Intercept dead/broken legacy placeholder URLs
  if (trimmed.includes('wb19kgrx') || trimmed.includes('default-store.png')) {
    return DEFAULT_STORE_LOGO;
  }
  if (trimmed.includes('default-banner.jpg') || trimmed.includes('flash-sale-banner.jpg')) {
    return DEFAULT_STORE_BANNER;
  }
  return trimmed;
};
