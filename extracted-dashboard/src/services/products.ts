import productsStaticJSON from '../../data/products.json' assert { type: 'json' };
import type { Products } from '../types/entities';

const productsStaticData: Products = productsStaticJSON;

export function getProducts() {
  return productsStaticData;
}
