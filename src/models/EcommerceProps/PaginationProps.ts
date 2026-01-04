export interface Pagination {
  initialPage?: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}