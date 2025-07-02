// src/utils/helpers.js

/**
 * Formats a date string into a more readable format.
 * @param {string} dateString - The date string to format (e.g., ISO 8601).
 * @returns {string} Formatted date (e.g., "July 4, 2025").
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Formats a date string to show "X days left" or "Expired".
 * Assumes dateString is in ISO format (e.g., "YYYY-MM-DDTHH:mm:ss").
 * @param {string} dateString - The deadline date string.
 * @returns {string} Status string.
 */
export const getDeadlineStatus = (dateString) => {
  if (!dateString) return 'No deadline';
  const now = new Date();
  const deadline = new Date(dateString);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'Expired';
  } else if (diffDays <= 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} left (Soon)`;
  } else {
    return `${diffDays} days left`;
  }
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to a specified length and adds ellipsis if necessary.
 * @param {string} str - The input string.
 * @param {number} maxLength - The maximum length before truncation.
 * @returns {string} The truncated string.
 */
export const truncateString = (str, maxLength) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

// Add more general utility functions here as needed