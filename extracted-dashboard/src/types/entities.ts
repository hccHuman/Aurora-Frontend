export type Products = Product[];
export interface Product {
  name: string;
  category: string;
  technology: string;
  id: number;
  description: string;
  price: string;
  discount: string;
}

export type Users = User[];
export interface User {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  biography?: string;
  position?: string;
  country?: string;
  status?: string;
}

export type EndpointsToOperations = {
  products: () => Products;
  users: () => Users;
  sales: () => { series: any[]; categories: string[] };
};

export type Endpoint = keyof EndpointsToOperations;
