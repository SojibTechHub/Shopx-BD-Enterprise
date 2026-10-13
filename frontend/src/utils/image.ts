export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=70';

export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

/**
 * Ensures a valid image URL is always returned.
 * Prevents React 19 empty string ("") src warning.
 */
export const getSafeImage = (
  url?: string | null,
  fallback: string = DEFAULT_PRODUCT_IMAGE
): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }
  return url.trim();
};
