import type { Product } from "../EcommerceProps/ProductsProps";

export interface ModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}
