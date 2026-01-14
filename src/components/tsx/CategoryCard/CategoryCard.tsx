import type { CategoryCard } from "@/models/EcommerceProps/CategoriesCardProps";
import { motion } from "framer-motion";
import { t } from "@/modules/YOLI/injector";

/**
 * CategoryCard Component
 *
 * A visual card representing a product category.
 * Provides a link to the category's product list page.
 * Uses framer-motion for hover effects and entrance animations.
 *
 * @component
 */
export default function CategoryCard({ lang, title, img }: CategoryCard & { delay?: number }) {
  const LowTitle = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <motion.a
      href={`/${lang}/${LowTitle}/productslist`}
      className="block"
      aria-label={t("products.aria_view_category", lang).replace("{target}", title)}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full rounded-xl overflow-hidden shadow-lg bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={img}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h4 className="text-slate-900 dark:text-slate-100 text-2xl font-semibold mb-2">
            {title}
          </h4>
        </div>
      </div>
    </motion.a>
  );
}
