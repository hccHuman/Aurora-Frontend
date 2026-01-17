/**
 * ProductCardSkeleton Component
 *
 * Skeleton loading state for ProductCard component.
 * Displays animated placeholders to prevent Cumulative Layout Shift (CLS)
 * while product data is being loaded.
 *
 * @component
 */
export default function ProductCardSkeleton() {
    return (
        <div
            className="w-full h-full flex flex-col rounded-xl overflow-hidden shadow-lg bg-slate-50 dark:bg-slate-900 transition-colors duration-300 animate-pulse"
            role="article"
            aria-busy="true"
            aria-label="Loading product"
        >
            {/* Image skeleton */}
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-800" />

            {/* Content skeleton */}
            <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex-1">
                    {/* Title skeleton */}
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />

                    {/* Description skeleton */}
                    <div className="space-y-2 mb-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                    </div>

                    {/* Price skeleton */}
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                </div>

                {/* Buttons skeleton */}
                <div className="flex justify-between items-center">
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                </div>
            </div>
        </div>
    );
}
