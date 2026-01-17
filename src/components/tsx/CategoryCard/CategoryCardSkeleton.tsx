/**
 * CategoryCardSkeleton Component
 *
 * Skeleton loading state for CategoryCard component.
 * Displays animated placeholders to prevent Cumulative Layout Shift (CLS)
 * while category data is being loaded.
 *
 * @component
 */
export default function CategoryCardSkeleton() {
    return (
        <div className="block h-full animate-pulse" aria-busy="true" aria-label="Loading category">
            <div className="w-full h-full flex flex-col rounded-xl overflow-hidden shadow-lg bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                {/* Image skeleton */}
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-800" />

                {/* Content skeleton */}
                <div className="p-6 flex-1 flex flex-col justify-center">
                    {/* Title skeleton */}
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
                </div>
            </div>
        </div>
    );
}
