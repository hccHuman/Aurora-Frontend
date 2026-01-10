/**
 * Validators Utility
 *
 * Provides reusable validation functions for ecommerce data structures.
 * Based on regular expressions and common business rules.
 */

/* =========================
   REGEX BASE
========================= */

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const NAME_REGEX =
  /^[A-Za-zÀ-ÿ\u00f1\u00d1\s'-]{2,50}$/;

const IBAN_REGEX =
  /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

const CREDIT_CARD_REGEX =
  /^\d{13,19}$/;

/**
 * Checks if a string value is not empty or whitespace only.
 *
 * @param {string | null} [value] - The string to validate
 * @returns {boolean} True if not empty
 */
export const isNotEmpty = (value?: string | null): boolean => {
  if (typeof value !== "string") return false;
  return value.trim().length > 0;
};

/**
 * Checks if a string has a minimum required length.
 *
 * @param {string} value - The string to validate
 * @param {number} min - Minimum characters
 * @returns {boolean} True if length >= min
 */
export const hasMinLength = (value: string, min: number): boolean =>
  value.trim().length >= min;

/**
 * Checks if a string does not exceed a maximum length.
 *
 * @param {string} value - The string to validate
 * @param {number} max - Maximum characters
 * @returns {boolean} True if length <= max
 */
export const hasMaxLength = (value: string, max: number): boolean =>
  value.trim().length <= max;

/**
 * Validates an email address format.
 *
 * @param {string} email - The email string
 * @returns {boolean} True if valid
 */
export const validateEmail = (email: string): boolean =>
  EMAIL_REGEX.test(email);

/**
 * Validates a password against security rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@$!%*?&)
 *
 * @param {string} password - The password string
 * @returns {boolean} True if valid
 */
export const validatePassword = (password: string): boolean =>
  PASSWORD_REGEX.test(password);

/**
 * Validates a person's name format (UTF-8 support).
 *
 * @param {string} name - The name to validate
 * @returns {boolean} True if valid
 */
export const validateName = (name: string): boolean =>
  NAME_REGEX.test(name);

/**
 * Validates an IBAN bank account number.
 * Removes spaces before validation.
 *
 * @param {string} iban - The IBAN string
 * @returns {boolean} True if valid
 */
export const validateIBAN = (iban: string): boolean =>
  IBAN_REGEX.test(iban.replace(/\s+/g, "").toUpperCase());

/**
 * Validates a credit card number format (13-19 digits).
 * Removes spaces before validation.
 *
 * @param {string} cardNumber - The card number string
 * @returns {boolean} True if valid
 */
export const validateCreditCard = (cardNumber: string): boolean =>
  CREDIT_CARD_REGEX.test(cardNumber.replace(/\s+/g, ""));

/**
 * Validates a product SKU format (Alphanumeric, underscores, hyphens).
 *
 * @param {string} sku - The SKU string
 * @returns {boolean} True if valid
 */
export const validateSKU = (sku: string): boolean =>
  /^[A-Z0-9_-]{3,30}$/.test(sku);

/**
 * Validates a price (must be >= 0).
 *
 * @param {number} price - The price value
 * @returns {boolean} True if valid
 */
export const validatePrice = (price: number): boolean =>
  !isNaN(price) && price >= 0;

/**
 * Validates a stock quantity (must be a non-negative integer).
 *
 * @param {number} stock - The stock value
 * @returns {boolean} True if valid
 */
export const validateStock = (stock: number): boolean =>
  Number.isInteger(stock) && stock >= 0;

/**
 * Validates a URL slug format.
 *
 * @param {string} slug - The slug string
 * @returns {boolean} True if valid
 */
export const validateSlug = (slug: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

/**
 * Validates a URL format (HTTP/HTTPS supported).
 *
 * @param {string} url - The URL string
 * @returns {boolean} True if valid
 */
export const validateURL = (url: string): boolean =>
  /^(https?:\/\/)[^\s$.?#].[^\s]*$/.test(url);
