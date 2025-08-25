/**
 * Utility functions for text formatting and manipulation
 */

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Truncates text by word boundary to avoid cutting words in half
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed, preserving word boundaries
 */
export const truncateTextByWords = (
  text: string,
  maxLength: number
): string => {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    return truncated.trim() + "...";
  }

  return truncated.substring(0, lastSpaceIndex).trim() + "...";
};

/**
 * Extracts and formats excerpt from HTML content
 * @param htmlContent - HTML content string
 * @param maxLength - Maximum length for excerpt
 * @returns Plain text excerpt
 */
export const extractExcerpt = (
  htmlContent: string,
  maxLength: number = 150
): string => {
  if (!htmlContent) return "";

  // Remove HTML tags
  const plainText = htmlContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return truncateTextByWords(plainText, maxLength);
};

/**
 * Capitalizes the first letter of a string
 * @param text - The text to capitalize
 * @returns Text with first letter capitalized
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Converts text to slug format (lowercase, hyphens instead of spaces)
 * @param text - The text to convert
 * @returns Slug formatted text
 */
export const toSlug = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Highlights search terms in text
 * @param text - The text to highlight
 * @param searchTerm - The term to highlight
 * @param highlightClass - CSS class for highlighting
 * @returns Text with highlighted search terms
 */
export const highlightSearchTerm = (
  text: string,
  searchTerm: string,
  highlightClass: string = "bg-yellow-200"
): string => {
  if (!text || !searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
};
