/**
 * Compatibility re-export for tests and legacy imports.
 * Some test suites import from `@/components/ui/animated-theme-toggler`.
 * Re-export the real component implementation which lives under
 * `components/tsx/ThemeToggle/animated-theme-toggler.tsx`.
 */
export { AnimatedThemeToggler } from '@/components/tsx/ThemeToggle/animated-theme-toggler';
export { AnimatedThemeToggler as default } from '@/components/tsx/ThemeToggle/animated-theme-toggler';
