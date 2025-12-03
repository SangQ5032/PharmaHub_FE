/**
 * Format currency value with Vietnamese Dong (VND) symbol
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "1.200.000 đ")
 */
export const formatCurrency = (amount: number): string => {
  if (!amount && amount !== 0) return '0 đ';

  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted;
};

/**
 * Format number with thousand separators
 * @param num - The number to format
 * @returns Formatted number string (e.g., "1.200.000")
 */
export const formatNumber = (num: number): string => {
  if (!num && num !== 0) return '0';

  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format date to Vietnamese format (dd/mm/yyyy)
 * @param date - The date to format (Date object or string)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Format percentage with 2 decimal places
 * @param value - The value to format as percentage
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "50.25%")
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2,
): string => {
  if (!value && value !== 0) return '0%';

  return `${value.toFixed(decimals)}%`;
};
