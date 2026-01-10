/**
 * Category Card Component Props Model
 *
 * Props interface for the CategoryCard component that displays
 * product category tiles in the homepage category grid.
 */

/**
 * CategoriesCardProps - Category card display properties
 *
 * Props passed to CategoryCard.astro component to render individual category tiles
 * in the responsive category grid on the homepage.
 *
 * @interface CategoriesCardProps
 * @property {string} title - Category name to display (e.g., "Electronics", "Clothing")
 * @property {string} img - Image URL for category background (relative or absolute path)
 *
 * @example
 * const electronicsCard: CategoriesCardProps = {
 *   title: "Electronics",
 *   img: "/img/categories/electronics.jpg"
 * }
 *
 * const clothingCard: CategoriesCardProps = {
 *   title: "Clothing & Fashion",
 *   img: "/img/categories/clothing.jpg"
 * }
 */
export interface CategoryCard {
  id?: number | string;
  lang: string;
  title: string;
  img: string;
}