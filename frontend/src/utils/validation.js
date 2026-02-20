/**
 * Form Validation Utilities
 * Reusable validation functions for authentication forms
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-z][A-Za-z' -]*$/;

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {string} Error message or empty string if valid
 */
export const validateEmail = (email) => {
    if (!email) return "Email is required";
    const value = email.trim();
    return EMAIL_REGEX.test(value) ? "" : "Email is not valid";
};

/**
 * Validate name (letters only, plus spaces, apostrophes, hyphens)
 * @param {string} name - Name to validate
 * @returns {string} Error message or empty string if valid
 */
export const validateName = (name) => {
    if (!name || !name.trim()) return "Name is required";
    const value = name.trim();
    return NAME_REGEX.test(value)
        ? ""
        : "Name can only contain letters, spaces, apostrophes, and hyphens";
};


// Requires at least one lowercase, one uppercase, one digit, and one symbol
const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

/**
 * Human-friendly description of the password rules
 * @param {number} minLength - Minimum password length
 * @returns {string} Rule description for helper text
 */
export const passwordRulesText = (minLength = 8) =>
    `Use at least ${minLength} characters with uppercase, lowercase, number, and symbol.`;

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum password length
 * @returns {string} Error message or empty string if valid
 */
export const validatePassword = (password, minLength = 8) => {
    if (!password) return "Password is required";
    if (password.length < minLength) return `Password must be at least ${minLength} characters`;
    return PASSWORD_COMPLEXITY_REGEX.test(password)
        ? ""
        : "Password must include uppercase, lowercase, number, and symbol";
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

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {string} Error message or empty string if valid
 */
export const validatePhoneNumber = (phone) => {
    if (!phone) return "Contact number is required";
    const phoneRegex = /^\d{10}$/; // Simple 10 digit validation
    return phoneRegex.test(phone.replace(/[^0-9]/g, '')) ? "" : "Invalid phone number (10 digits required)";
};
