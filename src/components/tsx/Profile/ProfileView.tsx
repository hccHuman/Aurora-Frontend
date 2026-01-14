import React, { useState } from "react";
import { useAtom } from "jotai";
import { userStore } from "@/store/userStore";
import { User, Mail, Calendar, ShoppingBag, Shield, Edit2, Save, X, Eye, EyeOff, AlertCircle, Clock } from "lucide-react";
import { fetchUserProfile, updateUserProfile } from "@/services/profileService";
import { validatePassword } from "@/utils/validators";
import { t } from "@/modules/YOLI/injector";

/**
 * ProfileView Component
 *
 * Displays user profile information in a premium card layout.
 * Allows editing user details with toggle between view and edit modes.
 *
 * @component
 */

interface ProfileViewProps {
    lang: string;
}

export default function ProfileView({ lang }: ProfileViewProps) {
    const [auth, setAuth] = useAtom(userStore);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        id: "",
        nombre: "",
        email: "",
        admin: false,
        activo: true,
        password: "",
    });

    React.useEffect(() => {
        const loadInitialData = async () => {
            if (auth.loggedIn && !isEditing) {
                setIsLoading(true);
                const profile = await fetchUserProfile();
                if (profile) {
                    setAuth((prev) => ({
                        ...prev,
                        user: {
                            ...prev.user,
                            ...profile,
                            // Normalize fields from different backend versions
                            id: (profile as any).id || (profile as any)._id || prev.user?.id,
                            nombre: (profile as any).nombre || (profile as any).name || (profile as any).fullName || prev.user?.nombre,
                            email: (profile as any).email || (profile as any).correo || prev.user?.email,
                            admin: (profile as any).admin ?? (profile as any).isAdmin ?? prev.user?.admin ?? false,
                            creado_en: (profile as any).creado_en || (profile as any).created_at || prev.user?.creado_en,
                            actualizado_en: (profile as any).actualizado_en || (profile as any).updated_at || prev.user?.actualizado_en,
                        } as any,
                    }));
                }
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [auth.loggedIn, setAuth]);

    React.useEffect(() => {
        if (auth.user) {
            setFormData({
                id: auth.user.id?.toString() || "",
                nombre: auth.user.nombre || "",
                email: auth.user.email || "",
                admin: auth.user.admin || false,
                activo: auth.user.activo ?? true,
                password: "", // Always reset on load
            });
        }
    }, [auth.user]);

    if (!auth.loggedIn || !auth.user) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">{t("profile.login_required", lang)}</p>
            </div>
        );
    }

    const { user } = auth;

    const handleSave = async () => {
        // Validate password if provided
        if (formData.password) {
            if (!validatePassword(formData.password)) {
                setPasswordError(t("profile.errors.password_invalid", lang));
                return;
            }
        }
        setPasswordError(null);

        const updated = await updateUserProfile(formData as any);
        if (updated) {
            console.log("Profile updated", updated);
            setAuth((prev) => ({
                ...prev,
                user: {
                    ...prev.user,
                    ...updated,
                    // Normalize fields from different backend versions
                    id: (updated as any).id || (updated as any)._id || prev.user?.id,
                    nombre: (updated as any).nombre || (updated as any).name || (updated as any).fullName || prev.user?.nombre,
                    email: (updated as any).email || (updated as any).correo || prev.user?.email,
                    admin: (updated as any).admin ?? (updated as any).isAdmin ?? prev.user?.admin ?? false,
                    actualizado_en: (updated as any).actualizado_en || (updated as any).updated_at || new Date().toISOString(),
                } as any,
            }));
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            id: user.id?.toString() || "",
            nombre: user.nombre || "",
            email: user.email || "",
            admin: user.admin || false,
            activo: user.activo ?? true,
            password: "",
        });
        setIsEditing(false);
        setShowPassword(false);
        setPasswordError(null);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t("profile.title", lang)}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t("profile.subtitle", lang)}</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all flex items-center gap-2"
                        aria-label={t("profile.edit", lang)}
                    >
                        <Edit2 className="w-4 h-4" />
                        {t("profile.edit", lang)}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
                {/* Main Profile Card */}
                <div className="bg-white/80 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700/50">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                            {formData.nombre?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 w-full">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase tracking-wider block mb-2">{t("profile.labels.name", lang)}</label>
                                        <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded-lg text-slate-900 dark:text-slate-200 focus:border-red-400/50 focus:outline-none transition-colors"
                                            aria-label={t("profile.labels.name", lang)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase tracking-wider block mb-2">{t("profile.labels.email", lang)}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded-lg text-slate-900 dark:text-slate-200 focus:border-red-400/50 focus:outline-none transition-colors"
                                            aria-label={t("profile.labels.email", lang)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase tracking-wider block mb-2">{t("profile.labels.new_password", lang)}</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                placeholder={t("profile.placeholders.password_hint", lang)}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, password: e.target.value });
                                                    if (passwordError) setPasswordError(null);
                                                }}
                                                className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border ${passwordError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700/50'} rounded-lg text-slate-900 dark:text-slate-200 focus:border-red-400/50 focus:outline-none transition-colors pr-10`}
                                                aria-label={t("profile.labels.new_password", lang)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                                aria-label={showPassword ? t("aria.hide_password", lang) : t("aria.show_password", lang)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordError && (
                                            <p className="mt-1 text-xs text-red-500 flex items-start gap-1">
                                                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                {passwordError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-1">{user.nombre}</h2>
                                    <p className="text-slate-400 mb-3">{user.email}</p>
                                    {user.admin && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium">
                                            <Shield className="w-4 h-4" />
                                            {t("profile.labels.admin", lang)}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Details */}
                    {!isEditing && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t("profile.labels.account_info", lang)}</h3>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-transparent">
                                <User className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{t("profile.labels.name", lang)}</p>
                                    <p className="text-slate-900 dark:text-slate-200 truncate">{user.nombre}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-transparent">
                                <Mail className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{t("profile.labels.email", lang)}</p>
                                    <p className="text-slate-900 dark:text-slate-200 truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-transparent">
                                <Calendar className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{t("profile.labels.member_since", lang)}</p>
                                    <p className="text-slate-900 dark:text-slate-200">
                                        {(user as any).creado_en
                                            ? new Date((user as any).creado_en).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { year: "numeric", month: "long", day: "numeric" })
                                            : t("profile.errors.date_unavailable", lang)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-transparent">
                                <Clock className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{t("profile.labels.last_update", lang)}</p>
                                    <p className="text-slate-900 dark:text-slate-200">
                                        {(user as any).actualizado_en
                                            ? new Date((user as any).actualizado_en).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { year: "numeric", month: "long", day: "numeric" })
                                            : t("profile.errors.date_unavailable", lang)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Mode Actions */}
                    {isEditing && (
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {t("profile.save", lang)}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                {t("profile.cancel", lang)}
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar: Quick Actions + Stats en línea */}
                <div className="flex flex-col md:flex-row md:gap-6 gap-6">
                    <div className="md:flex-1 bg-white/80 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t("profile.labels.quick_actions", lang)}</h3>
                        <div className="space-y-3">
                            <a
                                href={`/${lang}/products/checkout`}
                                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/30 hover:border-red-400/50 rounded-lg text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-all text-center text-sm md:text-base"
                            >
                                <ShoppingBag className="w-5 h-5 inline-block mr-2" />
                                {t("profile.labels.view_cart", lang)}
                            </a>
                            {user.admin && (
                                <a
                                    href={`/${lang}/dashboard`}
                                    className="block w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all text-center font-medium text-sm md:text-base"
                                >
                                    <Shield className="w-5 h-5 inline-block mr-2" />
                                    {t("profile.labels.admin_dashboard", lang)}
                                </a>
                            )}
                            <a
                                href={`/${lang}/account/logout`}
                                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/30 hover:border-slate-400 dark:hover:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 transition-all text-center text-sm md:text-base"
                            >
                                {t("profile.labels.logout", lang)}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
