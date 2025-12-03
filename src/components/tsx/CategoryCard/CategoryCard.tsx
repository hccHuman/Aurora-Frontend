import type { CategoryCard } from "@/models/EcommerceProps/CategoriesCardProps";

export default function CategoryCard({ lang, title, img }: CategoryCard) {
  const LowTitle = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <a href={`/${lang}/${LowTitle}/productslist`} className="block">
      <div className="w-full rounded-xl overflow-hidden shadow-lg bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <img
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
    </a>
  );
}
