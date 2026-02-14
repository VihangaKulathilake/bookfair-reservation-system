/**
 * Form Validation Utilities
 * Reusable validation functions for authentication forms
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {string} Error message or empty string if valid
 */
export const validateEmail = (email) => {
    if (!email) return "Email is required";
    return /.+@.+\..+/.test(email) ? "" : "Email is not valid";
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum password length
 * @returns {string} Error message or empty string if valid
 */
export const validatePassword = (password, minLength = 6) => {
    if (!password) return "Password is required";
    return password.length >= minLength ? "" : `Password must be at least ${minLength} characters`;
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string} Error message or empty string if valid
 */
export const validateRequired = (value, fieldName = "This field") => {
    return value && value.trim() ? "" : `${fieldName} is required`;
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string} Error message or empty string if valid
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    return password === confirmPassword ? "" : "Passwords do not match";
};
