import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";
import type  { Lang } from "@/models/SystemProps/LangProps";

const AccountMenu: React.FC<Lang> = ({ lang }) => {
  const auth = useAtomValue(userStore);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("🟢 [AccountMenu] Estado del usuario:", auth);
  }, [auth]);

  if (!mounted) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-48 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg z-50 bg-slate-50 dark:bg-slate-900 transition-colors duration-300"
      role="menu"
      aria-label="Account menu"
    >
      {auth.loggedIn ? (
        <>
          <a
            href={`/${lang}/account/profile`}
            className="block px-4 py-2 text-slate-900 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-300"
            role="menuitem"
          >
            Perfil
          </a>

          {/* 🔐 SOLO ADMIN */}
          {auth.user?.admin && (
            <>
              <hr className="border-t border-slate-300 dark:border-slate-600 my-1" />
              <a
                href={`/${lang}/dashboard`}
                className="block px-4 py-2 font-semibold text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-300"
                role="menuitem"
              >
                Dashboard
              </a>
            </>
          )}

          <hr className="border-t border-slate-300 dark:border-slate-600 my-1" />

          <a
            href={`/${lang}/account/logout`}
            className="block px-4 py-2 text-slate-900 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-300"
            role="menuitem"
          >
            Cerrar Sesión
          </a>
        </>
      ) : (
        <a
          href={`/${lang}/account/login`}
          className="block px-4 py-2 text-slate-900 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-300"
          role="menuitem"
        >
          Iniciar Sesión
        </a>
      )}
    </div>
  );
};

export default AccountMenu;
