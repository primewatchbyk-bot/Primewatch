import { WatchProduct, StoreSettings } from '../types';
import { INITIAL_WATCHES, INITIAL_SETTINGS } from '../data/initialData';

const SETTINGS_KEY = 'primewatch_settings_v1.2';
const WATCHES_KEY = 'primewatch_products_v1.2';

/**
 * Format price with currency symbol and thousands separator
 */
export function formatPrice(amount: number, currencySymbol = '₦'): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${currencySymbol}${formatted}`;
}

/**
 * Compress an image file in-browser to a compact JPEG data URL
 */
export async function compressImageFile(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Safely set localStorage item with auto-retry
 */
function safeSetStorage(key: string, value: string, maxRetries = 3): boolean {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      attempt++;
      console.warn(`Storage write retry ${attempt}/${maxRetries} for key: ${key}`, err);
      if (attempt >= maxRetries) {
        console.error(`Storage save failed permanently for key ${key}:`, err);
        return false;
      }
    }
  }
  return false;
}

/**
 * Load store settings with initial fallback
 */
export function loadSettings(): StoreSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Error loading settings from storage', e);
  }
  saveSettings(INITIAL_SETTINGS);
  return INITIAL_SETTINGS;
}

/**
 * Save store settings
 */
export function saveSettings(settings: StoreSettings): boolean {
  try {
    return safeSetStorage(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
    return false;
  }
}

/**
 * Load product catalog with initial fallback
 */
export function loadWatches(): WatchProduct[] {
  try {
    const saved = localStorage.getItem(WATCHES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      }
    }
  } catch (e) {
    console.error('Error loading watches from storage', e);
  }
  saveWatches(INITIAL_WATCHES);
  return INITIAL_WATCHES;
}

/**
 * Save watches catalog
 */
export function saveWatches(watches: WatchProduct[]): boolean {
  try {
    return safeSetStorage(WATCHES_KEY, JSON.stringify(watches));
  } catch (e) {
    console.error('Error saving watches', e);
    return false;
  }
}

/**
 * Reset store to sample catalog & default settings
 */
export function resetToDefaults(): { settings: StoreSettings; watches: WatchProduct[] } {
  saveSettings(INITIAL_SETTINGS);
  saveWatches(INITIAL_WATCHES);
  return { settings: INITIAL_SETTINGS, watches: INITIAL_WATCHES };
}

/**
 * Format WhatsApp direct message link
 */
export function buildWhatsAppLink(phone: string, productCode: string, productName: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const text = `Hello, I'm interested in Product [${productCode}] - ${productName}. Is it available?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Format general WhatsApp inquiry link
 */
export function buildGeneralWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const text = message || "Hello Kayode, I saw your PrimeWatch catalog and I'd like to make an inquiry.";
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
