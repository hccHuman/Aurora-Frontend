import React, { useState, useEffect, useRef } from "react";
import { Eye, Moon, Sun, Check, Zap, Focus } from "lucide-react";
import { themeManager, accessibilityManager, cvdManager, type CvdMode } from "@/modules/LUCIA";

/**
 * AccessibilityMenu Component
 *
 * A floating menu that allows users to customize accessibility settings.
 * Integrates with the LUCIA module for:
 * - Theme switching (Dark/Light mode)
 * - Color Vision Deficiency (CVD) filters
 * - Epilepsy-safe animations
 * - Focus mode (ADHD support)
 *
 * Listens for global LUCIA events to stay synchronized with external changes.
 *
 * @component
 */
const AccessibilityMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [currentCvd, setCurrentCvd] = useState<CvdMode>("normal");
    const [isEpilepsySafe, setIsEpilepsySafe] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Initialize state from LUCIA
    useEffect(() => {
        setIsDark(themeManager.getTheme() === "dark");
        setCurrentCvd(cvdManager.getCvdMode());
        setIsEpilepsySafe(accessibilityManager.isEpilepsySafe());
        setIsFocusMode(accessibilityManager.isFocusMode());

        // Listen for global changes
        const handleThemeChange = (e: any) => setIsDark(e.detail === "dark");
        const handleCvdChange = (e: any) => setCurrentCvd(e.detail);
        const handleAccessChange = (e: any) => {
            const { type, value } = e.detail;
            if (type === 'epilepsy') setIsEpilepsySafe(value);
            if (type === 'adhd') setIsFocusMode(value);
        };

        window.addEventListener("theme-changed" as any, handleThemeChange);
        window.addEventListener("cvd-changed" as any, handleCvdChange);
        window.addEventListener("accessibility-changed" as any, handleAccessChange);

        return () => {
            window.removeEventListener("theme-changed" as any, handleThemeChange);
            window.removeEventListener("cvd-changed" as any, handleCvdChange);
            window.removeEventListener("accessibility-changed" as any, handleAccessChange);
        };
    }, []);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = (e: React.MouseEvent) => {
        themeManager.toggleTheme(e.nativeEvent);
    };

    const handleCvdChange = (mode: CvdMode) => {
        cvdManager.setCvdMode(mode);
    };

    const cvdOptions: { value: CvdMode; label: string }[] = [
        { value: "normal", label: "Normal" },
        { value: "cvd-protanopia", label: "Protanopia (Red-Blind)" },
        { value: "cvd-deuteranopia", label: "Deuteranopia (Green-Blind)" },
        { value: "cvd-tritanopia", label: "Tritanopia (Blue-Blind)" },
        { value: "cvd-achromatopsia", label: "Achromatopsia (Mono)" },
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Accessibility Menu"
                aria-expanded={isOpen}
            >
                <Eye className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-50 p-5 transition-all animate-in fade-in zoom-in-95 duration-300">
                    <div className="space-y-6">
                        {/* Theme Section */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                <Moon className="w-4 h-4 text-red-400" /> Apariencia
                            </h3>
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-red-400/50 hover:bg-slate-800 transition-all group"
                            >
                                <span className="text-sm text-slate-200 group-hover:text-red-400 transition-colors">
                                    {isDark ? "Modo Oscuro" : "Modo Claro"}
                                </span>
                                {isDark ? (
                                    <Moon className="w-4 h-4 text-red-400" />
                                ) : (
                                    <Sun className="w-4 h-4 text-amber-500" />
                                )}
                            </button>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        {/* Cognitive Section */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-red-400" /> Preferencias de Usuario
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => accessibilityManager.setEpilepsySafe(!isEpilepsySafe)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all border ${isEpilepsySafe ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-800/50 border-slate-700/30 text-slate-300 hover:border-red-400/30 hover:bg-slate-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-sm">Modo Anti-Epilepsia</span>
                                    </div>
                                    {isEpilepsySafe && <Check className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => accessibilityManager.setFocusMode(!isFocusMode)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all border ${isFocusMode ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-800/50 border-slate-700/30 text-slate-300 hover:border-red-400/30 hover:bg-slate-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Focus className="w-4 h-4" />
                                        <span className="text-sm">Modo TDAH / Enfoque</span>
                                    </div>
                                    {isFocusMode && <Check className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        {/* CVD Section */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-red-400" /> Daltonismo
                            </h3>
                            <div className="space-y-1.5">
                                {cvdOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleCvdChange(option.value)}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${currentCvd === option.value
                                            ? "bg-red-500/10 text-red-400 border border-red-500/30 font-semibold"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-red-400"
                                            }`}
                                    >
                                        <span className="transition-transform group-hover:translate-x-1">{option.label}</span>
                                        {currentCvd === option.value && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessibilityMenu;
