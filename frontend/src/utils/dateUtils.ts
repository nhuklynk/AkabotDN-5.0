/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Safely formats a date string to Vietnamese locale
 * @param dateString - The date string to format
 * @returns Formatted date string or fallback message if invalid
 */
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "Không rõ ngày";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleDateString("vi-VN");
  } catch (error) {
    return "Ngày không hợp lệ";
  }
};

/**
 * Formats a date string to Vietnamese locale with time
 * @param dateString - The date string to format
 * @returns Formatted date and time string or fallback message if invalid
 */
export const formatDateTime = (dateString: string | undefined | null): string => {
  if (!dateString) return "Không rõ ngày giờ";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày giờ không hợp lệ";
    return date.toLocaleString("vi-VN");
  } catch (error) {
    return "Ngày giờ không hợp lệ";
  }
};

/**
 * Formats a date string to relative time (e.g., "2 days ago")
 * @param dateString - The date string to format
 * @returns Relative time string or fallback message if invalid
 */
export const formatRelativeTime = (dateString: string | undefined | null): string => {
  if (!dateString) return "Không rõ thời gian";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Thời gian không hợp lệ";
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return formatDate(dateString);
  } catch (error) {
    return "Thời gian không hợp lệ";
  }
};

/**
 * Checks if a date string is valid
 * @param dateString - The date string to validate
 * @returns True if valid, false otherwise
 */
export const isValidDate = (dateString: string | undefined | null): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};
