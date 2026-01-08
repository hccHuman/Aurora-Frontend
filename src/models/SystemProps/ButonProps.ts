/**
 * Button Component Props Model
 *
 * Props interface for button components, particularly ProductCardButton.
 * Includes product information needed to handle cart operations.
 */

/**
 * Props - Button component properties
 *
 * Standard props for button components that interact with products.
 * Used primarily by ProductCardButton for "Add to Cart" functionality.
 *
 * @interface Props
 * @property {string} title - Product name or button label text
 * @property {number} id - Product ID for identifying the item in cart operations
 *
 * @example
 * const buttonProps: Props = {
 *   title: "Gaming Laptop",
 *   id: 42
 * }
 *
 * // Usage in component:
 * <ProductCardButton title={product.name} id={product.id} />
 */
export interface ButtonProps {
  title: string;
  id: number;
  category_id?: number;
}
