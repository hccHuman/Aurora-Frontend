import type { Product } from "../EcommerceProps/ProductsProps";

/**
 * Modal Props Model
 * 
 * Defines the structure for product details modal.
 * Used by `ProductModal` and `ProductModalWrapper`.
 */
export interface ModalProps {
  /** The product data to display in the modal, or null if no product is selected */
  product: Product | null;
  /** Whether the modal is currently open */
  open: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
}
