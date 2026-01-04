export type Order = {
  transaction: string;
  datetime: string;
  amount: string | number;
  reference: string;
  method: string;
  status: string;
};

export interface OrdersResponse {
  data: Order[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}