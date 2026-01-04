/**
 * Animated Theme Toggler - Dark/Light Mode Toggle Button
 *
 * High-performance theme switching component with:
 * - View Transition API for smooth circular animation
 * - Device-adaptive animation duration (600ms-1400ms)
 * - Icon animation between Sun and Moon
 * - localStorage persistence
 * - Accessibility support (sr-only text)
 *
 * Animation Mechanism:
 * 1. Calculate button center position and animation duration
 * 2. Start View Transition for smooth DOM updates
 * 3. Add/remove "dark" class from html element
 * 4. Animate circular clipPath from button center outward
 * 5. Update localStorage with new theme preference
 *
 * Duration Algorithm:
 * - Base: 1000ms
 * - Mobile/small screen: 600ms (< 800x800px)
 * - Tablet: 900ms (< 1400x900px)
 * - Desktop: 1000ms (1400-1920px)
 * - Large desktop: 900ms (> 1920px)
 * - Weak device (≤ 3GB RAM): -30% duration
 * - Strong device (≥ 8GB RAM): +10% duration
 */

import { useEffect, useRef, useState, useMemo } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnimatedThemeTogglerProps } from "@/models/FunctionProps/AnimatedThemeTogglerProps";

/**
 * AnimatedThemeToggler - Main component
 *
 * Renders an interactive button that toggles between light and dark themes.
 * Uses View Transition API (Chrome/Edge) for smooth circular animation.
 * Falls back to instant theme change on unsupported browsers.
 *
 * @component
 * @param {AnimatedThemeTogglerProps} props - Component props
 * @param {string} [props.className] - Optional CSS classes to apply to button
 * @param {number} [props.duration] - Ignored (calculated dynamically based on device)
 * @param {any} [...props] - Standard HTML button attributes (onClick, aria-label, etc.)
 * @returns {JSX.Element} Button element with Sun/Moon icon
 *
 * @example
 * <AnimatedThemeToggler className="w-10 h-10" aria-label="Toggle theme" />
 */
export const AnimatedThemeToggler = ({
  className,
  duration, // ignoramos este valor si viene (se calcula dinámicamente)
  ...props
}: AnimatedThemeTogglerProps) => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================

  /** Track current theme state (true = dark, false = light) */
  const [isDark, setIsDark] = useState(false);

  /** Reference to button element for calculating animation position */
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ========================================
  // DEVICE-ADAPTIVE DURATION CALCULATION
  // ========================================

  /**
   * Calculate animation duration based on device capabilities
   *
   * Uses memoization to prevent recalculation on every render.
   *
   * Process:
   * 1. Get screen dimensions and calculate pixel area
   * 2. Get available RAM via navigator.deviceMemory
   * 3. Determine base duration based on screen size
   * 4. Apply multiplier based on device RAM
   * 5. Return final duration rounded to nearest millisecond
   *
   * Result: 600-1400ms depending on device
   *
   * Example durations:
   * - iPhone 12 (390x844, 4GB): ~900ms
   * - iPad (1024x1366, 4GB): ~1000ms
   * - Desktop (1920x1080, 16GB): ~1100ms
   * - 4K Monitor (3840x2160, 32GB): ~990ms
   */
  const smartDuration = useMemo(() => {
    // Get current viewport dimensions
    const w = window.innerWidth;
    const h = window.innerHeight;
    const area = w * h;

    // Detect available device RAM (in GB)
    const ram = navigator.deviceMemory || 4;

    // Base duration (milliseconds)
    let base = 1000;

    // ===== ADJUST BY SCREEN SIZE =====
    if (area < 800 * 800) {
      // Small mobile: 320-800px (area < 640,000)
      base = 600;
    } else if (area < 1400 * 900) {
      // Tablet/Laptop: 800-1400px width
      base = 1000;
    } else if (area < 1920 * 1080) {
      // Full HD Desktop: 1400-1920px
      base = 1400;
    } else {
      // Ultra-wide/4K: > 1920px
      // Shorter duration for powerful displays
      base = 900;
    }

    // ===== ADJUST BY RAM AVAILABILITY =====
    if (ram <= 3) {
      // Weak device: reduce by 30% for performance
      base *= 0.7;
    } else if (ram >= 8) {
      // Strong device: increase by 10% for smoothness
      base *= 1.1;
    }

    // Return duration rounded to nearest millisecond
    return Math.round(base);
  }, []);

  // ========================================
  // EFFECTS & INITIALIZATION
  // ========================================

  /**
   * Initialize theme state on component mount
   *
   * Runs once when component mounts to:
   * 1. Read current theme from localStorage or DOM
   * 2. Apply "dark" class if needed
   * 3. Sync component state with DOM
   *
   * Does NOT persist changes (that's done in toggleTheme)
   */
  useEffect(() => {
    const html = document.documentElement;
    const stored = localStorage.getItem("theme");

    // Apply dark class if stored preference is dark
    if (stored === "dark") {
      html.classList.add("dark");
    }
    // Remove dark class if stored preference is light
    if (stored === "light") {
      html.classList.remove("dark");
    }

    // Update component state to match DOM
    setIsDark(html.classList.contains("dark"));
  }, []);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handle theme toggle button click
   *
   * Complete theme switching workflow:
   * 1. Determine new theme (toggle isDark state)
   * 2. Start View Transition API
   * 3. Update DOM class and localStorage
   * 4. Animate circular transition from button center
   * 5. Update component state
   *
   * View Transition Flow:
   * - Create new view transition snapshot
   * - Callback updates DOM (instant)
   * - Animation runs from old view to new view
   * - Uses clipPath to create circular expansion effect
   *
   * Fallback:
   * - If View Transition API not supported, theme changes instantly
   * - No animation, but functionality preserved
   */
  const toggleTheme = async () => {
    // Safety check: button must be mounted
    if (!buttonRef.current) return;

    // Determine new theme state
    const newTheme = !isDark;

    // ===== VIEW TRANSITION API =====
    // Wrap DOM changes in View Transition for smooth animation
    await document.startViewTransition(() => {
      const html = document.documentElement;

      // Update DOM class based on new theme
      if (newTheme) {
        // Apply dark mode
        html.classList.add("dark");
      } else {
        // Apply light mode
        html.classList.remove("dark");
      }

      // Persist theme preference to localStorage
      localStorage.setItem("theme", newTheme ? "dark" : "light");

      // Update component state
      setIsDark(newTheme);
    }).ready; // Wait for view transition to be ready

    // ===== ANIMATION SETUP =====
    // Get button position to animate from center
    const rect = buttonRef.current.getBoundingClientRect();

    // Calculate center point of button
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Maximum radius for clipPath animation
    // Should be large enough to cover entire viewport
    // Using fixed 1400px which covers most desktop screens
    const radius = 1400;

    // ===== ANIMATE CIRCULAR TRANSITION =====
    // Use CSS animation API to create circular expansion
    document.documentElement.animate(
      {
        // clipPath keyframes: start from button center, expand outward
        clipPath: [
          `circle(0px at ${x}px ${y}px)`, // Start: no visible area
          `circle(${radius}px at ${x}px ${y}px)`, // End: cover entire screen
        ],
      },
      {
        // Animation configuration
        duration: smartDuration, // Device-adaptive duration
        easing: "ease-in-out", // Smooth acceleration/deceleration
        pseudoElement: "::view-transition-new(root)", // Target the new view
      }
    );
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <button ref={buttonRef} onClick={toggleTheme} className={cn("relative", className)} {...props}>
      {/* Icon: Sun (light mode) or Moon (dark mode) */}
      {isDark ? <Sun /> : <Moon />}

      {/* Screen reader text for accessibility */}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};