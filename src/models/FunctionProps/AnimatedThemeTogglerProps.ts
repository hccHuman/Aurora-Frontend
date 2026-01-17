/**
 * Animated Theme Toggler Props Model
 *
 * Props for the AnimatedThemeToggler component that renders an animated
 * button for switching between light and dark modes.
 */

/**
 * AnimatedThemeTogglerProps - Theme toggle button properties
 *
 * Extends standard React button props to allow customization of animation duration
 * and all standard HTML button attributes (onClick, className, etc.).
 *
 * @interface AnimatedThemeTogglerProps
 * @extends React.ComponentPropsWithoutRef<"button">
 * @property {number} [duration] - Animation duration in milliseconds (e.g., 300 for 300ms transition)
 *                                 Default: 300ms if not specified
 *
 * @example
 * const props: AnimatedThemeTogglerProps = {
 *   duration: 500,
 *   onClick: handleThemeChange,
 *   className: "custom-button",
 *   "aria-label": "Toggle theme"
 * }
 *
 * // Usage:
 * <AnimatedThemeToggler duration={400} onClick={handleToggle} />
 */
export interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  lang?: string;
}
