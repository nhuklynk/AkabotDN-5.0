/**
 * Helper functions for FlipBook component
 */

/**
 * Generate array of page URLs for FlipBook
 * @param basePath - Base path to images (e.g., "/images/charter/")
 * @param totalPages - Total number of pages
 * @param fileExtension - Image file extension (jpg, png, webp)
 * @param prefix - File prefix (e.g., "page-")
 * @returns Array of page URLs
 */
export function generatePageUrls(
  basePath: string,
  totalPages: number,
  fileExtension: string = "jpg",
  prefix: string = "page-"
): string[] {
  return Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = (index + 1).toString().padStart(2, "0");
    return `${basePath}${prefix}${pageNumber}.${fileExtension}`;
  });
}

/**
 * Generate charter pages specifically for NDA
 * @param totalPages - Total number of pages in charter (default: 25)
 * @returns Array of charter page URLs
 */
export function generateCharterPages(totalPages: number = 21): string[] {
  return generatePageUrls("/images/charter/", totalPages, "png", "page-");
}

/**
 * Preload images for better performance
 * @param imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls: string[]): void {
  imageUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Check if image exists
 * @param url - Image URL to check
 * @returns Promise that resolves to boolean
 */
export function imageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Get responsive image dimensions based on screen size
 * @param baseWidth - Base width for desktop
 * @param baseHeight - Base height for desktop
 * @returns Object with width and height
 */
export function getResponsiveDimensions(
  baseWidth: number = 500,
  baseHeight: number = 650
) {
  if (typeof window === "undefined") {
    return { width: baseWidth, height: baseHeight };
  }

  const screenWidth = window.innerWidth;

  if (screenWidth < 768) {
    // Mobile
    return {
      width: Math.min(screenWidth - 40, 300),
      height: Math.min(screenWidth - 40, 300) * (baseHeight / baseWidth),
    };
  } else if (screenWidth < 1024) {
    // Tablet
    return {
      width: Math.min(screenWidth * 0.6, 400),
      height: Math.min(screenWidth * 0.6, 400) * (baseHeight / baseWidth),
    };
  } else {
    // Desktop
    return { width: baseWidth, height: baseHeight };
  }
}

/**
 * Format page number for display
 * @param pageNumber - Current page number (0-based)
 * @param totalPages - Total number of pages
 * @returns Formatted string like "Page 1 of 25"
 */
export function formatPageDisplay(
  pageNumber: number,
  totalPages: number
): string {
  return `Page ${pageNumber + 1} of ${totalPages}`;
}

/**
 * Calculate reading progress percentage
 * @param currentPage - Current page (0-based)
 * @param totalPages - Total number of pages
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(
  currentPage: number,
  totalPages: number
): number {
  return Math.round(((currentPage + 1) / totalPages) * 100);
}

/**
 * Keyboard event handler for FlipBook navigation
 * @param event - Keyboard event
 * @param handlers - Object with navigation functions
 */
export function handleFlipBookKeyboard(
  event: KeyboardEvent,
  handlers: {
    nextPage: () => void;
    prevPage: () => void;
    toggleFullscreen?: () => void;
    goToPage?: (page: number) => void;
  }
): void {
  switch (event.key) {
    case "ArrowRight":
    case " ":
    case "PageDown":
      event.preventDefault();
      handlers.nextPage();
      break;
    case "ArrowLeft":
    case "PageUp":
      event.preventDefault();
      handlers.prevPage();
      break;
    case "f":
    case "F":
      if (handlers.toggleFullscreen) {
        event.preventDefault();
        handlers.toggleFullscreen();
      }
      break;
    case "Home":
      if (handlers.goToPage) {
        event.preventDefault();
        handlers.goToPage(0);
      }
      break;
    case "End":
      if (handlers.goToPage) {
        event.preventDefault();
        // This would need totalPages passed in
      }
      break;
  }
}
