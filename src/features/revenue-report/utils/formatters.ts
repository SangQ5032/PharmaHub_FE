/**
 * Format currency to Vietnamese Dong
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return `đ${amount.toLocaleString('vi-VN')}`;
};

/**
 * Format currency to shortened version (K format)
 * @param amount - The amount to format
 * @returns Formatted currency string in K format
 */
export const formatCurrencyShort = (amount: number): string => {
  return `${(amount / 1000).toFixed(0)}K`;
};

/**
 * Format full currency with đ suffix
 * @param amount - The amount to format
 * @returns Formatted currency string with đ suffix
 */
export const formatFullCurrency = (amount: number): string => {
  return `${amount.toLocaleString('vi-VN')}đ`;
};

/**
 * Get initials from a full name
 * @param name - Full name
 * @returns Initials (1-2 characters)
 */
export const getInitials = (name: string): string => {
  const words = name.split(' ').filter(word => word.length > 0);

  if (words.length === 0) {
    return '';
  }

  if (words.length === 1) {
    return name.substring(0, 2).toUpperCase();
  }

  // Return first letter of first word + first letter of last word
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};
