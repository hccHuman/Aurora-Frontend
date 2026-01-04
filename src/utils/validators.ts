/**
 * validators.ts
 * ----------------
 * Validadores reutilizables para ecommerce
 * Basados en expresiones regulares y reglas de negocio comunes
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

/* =========================
   VALIDADORES GENERALES
========================= */

export const isNotEmpty = (value?: string | null): boolean => {
  if (typeof value !== "string") return false;
  return value!.trim().length > 0;
};

export const hasMinLength = (value: string, min: number): boolean =>
  value.trim().length >= min;

export const hasMaxLength = (value: string, max: number): boolean =>
  value.trim().length <= max;

/* =========================
   VALIDADORES DE USUARIO
========================= */

export const validateEmail = (email: string): boolean =>
  EMAIL_REGEX.test(email);

export const validatePassword = (password: string): boolean =>
  PASSWORD_REGEX.test(password);
/**
 * Reglas:
 * - mínimo 8 caracteres
 * - 1 mayúscula
 * - 1 minúscula
 * - 1 número
 * - 1 carácter especial
 */

export const validateName = (name: string): boolean =>
  NAME_REGEX.test(name);

/* =========================
   VALIDADORES DE PAGO
========================= */

export const validateIBAN = (iban: string): boolean =>
  IBAN_REGEX.test(iban.replace(/\s+/g, "").toUpperCase());

export const validateCreditCard = (cardNumber: string): boolean =>
  CREDIT_CARD_REGEX.test(cardNumber.replace(/\s+/g, ""));

/* =========================
   VALIDADORES DE PRODUCTO
========================= */

export const validateSKU = (sku: string): boolean =>
  /^[A-Z0-9_-]{3,30}$/.test(sku);

export const validatePrice = (price: number): boolean =>
  !isNaN(price) && price >= 0;

export const validateStock = (stock: number): boolean =>
  Number.isInteger(stock) && stock >= 0;

/* =========================
   VALIDADORES DE URL / SLUG
========================= */

export const validateSlug = (slug: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export const validateURL = (url: string): boolean =>
  /^(https?:\/\/)[^\s$.?#].[^\s]*$/.test(url);
