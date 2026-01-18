import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";
import type { Lang } from "@/models/SystemProps/LangProps";
import { User, Shield, LogOut } from "lucide-react";
import { useYOLI } from "@/modules/YOLI/injector";

/**
 * AccountMenu Component
 *
 * A dropdown menu that provides links to user-related pages (Profile, Logout).
 * Displays an additional link to the Dashboard if the user has administrative privileges.
 * Synchronizes with the global userStore to show the appropriate menu items.
 *
 * @component
 */
const AccountMenu: React.FC<Lang> = ({ lang }) => {
  const auth = useAtomValue(userStore);
  const [mounted, setMounted] = useState(false);
  const t = useYOLI(lang);

  useEffect(() => {
    setMounted(true);
  }, [auth]);

  if (!mounted) return null;

  return (
    <div
      className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl p-5 transition-all animate-in fade-in zoom-in-95 duration-300"
      role="menu"
      aria-label={t("aria.account_menu")}
    >
      {auth.loggedIn ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            {t("header.my_account")}
          </h3>
          <a
            href={`/${lang}/account/profile`}
            className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30 hover:border-slate-600 rounded-lg text-slate-200 transition-all duration-200 group"
            role="menuitem"
          >
            <User className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
            <span>{t("header.profile")}</span>
          </a>

          {/* 🔐 SOLO ADMIN */}
          {auth.user?.admin && (
            <a
              href={`/${lang}/dashboard`}
              className="flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 transition-all duration-200 group"
              role="menuitem"
            >
              <Shield className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
              <span>{t("header.dashboard")}</span>
            </a>
          )}

          <div className="h-px bg-slate-700/50 my-1 mx-2" />

          <a
            href={`/${lang}/account/logout`}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200 group"
            role="menuitem"
          >
            <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
            <span>{t("header.logout")}</span>
          </a>
        </div>
      ) : (
        <a
          href={`/${lang}/account/login`}
          className="block px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-slate-200 hover:text-white transition-all duration-200 text-center font-medium"
          role="menuitem"
        >
          {t("header.login")}
        </a>
      )
      }
    </div >
  );
};

export default AccountMenu;
