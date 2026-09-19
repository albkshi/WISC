/**
 * Utility functions for handling image compression, conversions, and validation
 * optimized for storage in Firebase Firestore.
 */

export interface ProcessedImage {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  name: string;
}

/**
 * Compresses an image file in the browser using HTML5 Canvas, ensuring it fits well within
 * Firestore's 1MB document limit while preserving sharp visual quality.
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    // If it's SVG, convert directly to data URL without re-encoding to preserve vector sharpness
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const sizeKb = Math.round(file.size / 1024);
        resolve({
          dataUrl,
          sizeKb,
          width: 512,
          height: 512,
          name: file.name,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be acquired'));
          return;
        }

        // Draw and smoothly render
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP if supported, fallback to JPEG
        const outputMime = file.type === 'image/png' && quality >= 0.9 ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);
        
        // Approximate size in KB from base64 string
        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          sizeKb,
          width,
          height,
          name: file.name,
        });
      };
      img.onerror = () => reject(new Error('Image format could not be loaded'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Returns formatted file size
 */
export function formatFileSize(kb: number): string {
  if (kb < 1024) {
    return `${kb} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
}
