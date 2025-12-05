"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import {
  Home,
  User,
  Box as BoxIcon,
  List as ListIcon,
  ShoppingCart,
  Clipboard,
  LogOut,
} from "lucide-react";

const links = [
  { name: "Inicio", href: "/dashboard/home", icon: <Home className="w-5 h-5" /> },
  { name: "Usuarios", href: "/dashboard/users", icon: <User className="w-5 h-5" /> },
  { name: "Productos", href: "/dashboard/productos", icon: <BoxIcon className="w-5 h-5" /> },
  { name: "Inventario", href: "/dashboard/inventario", icon: <ListIcon className="w-5 h-5" /> },
  { name: "Ventas", href: "/dashboard/ventas", icon: <ShoppingCart className="w-5 h-5" /> },
  { name: "Reportes", href: "/dashboard/reportes", icon: <Clipboard className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-[#FFDEDE] border-b border-gray-200 fixed z-30 w-full ">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Avatar className="w-16 h-16 ml-8">
                <AvatarImage src="https://scontent.fcbb1-1.fna.fbcdn.net/v/t39.30808-6/457194139_537118228662786_4835914457282046923_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=6xfD_hvslxYQ7kNvwFXH65H&_nc_oc=AdnJuJvHFA4vjP2JFmGThikpKWUJWivppFsAQxRhGusKciOuxk01URxqMvRsJ7sHswOlPHpSNu1AJGC1BdQenfLX&_nc_zt=23&_nc_ht=scontent.fcbb1-1.fna&_nc_gid=qRctZiQmhxaaiGg_r46mpg&oh=00_AfgU7epzX_6pyH88txQnjWq-gjIb4KOsdbYCBgCdONgzVg&oe=692FFD5C" />
                <AvatarFallback>GH</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center pr-6">
              <div className="bg-blue-500 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center">
                FH
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex overflow-hidden bg-white pt-16">
        {/* SIDEBAR */}
        <aside
          id="sidebar"
          className="fixed z-20 h-full top-0 left-0 pt-24 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-150 border-r border-gray-200 bg-white"
          aria-label="Sidebar"
        >
          <div className="flex-1 flex flex-col min-h-0 ">
            <div className="overflow-y-auto py-5 px-3">
              <ul className="space-y-2">
                {links.map((link) => {
                  const isActive = pathname?.startsWith(link.href) ?? false;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`group flex items-center gap-3 p-3 rounded-md border ${isActive ? "border-blue-600 bg-white shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50"} text-gray-900`}
                      >
                        <span className={`flex items-center justify-center w-7 h-7 rounded ${isActive ? "text-blue-600" : "text-gray-600"}`}>
                          {link.icon}
                        </span>
                        <span className="ml-2 text-sm">{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Logout fijo en la parte inferior */}
            <div className="px-3 pb-6">
              <div className="border-t border-gray-200 pt-4">
                <Button
  variant="ghost"
  size="sm"
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  }}
  className="text-red-600 hover:bg-red-50"
>
  <LogOut className="mr-2 h-4 w-4" />
  Cerrar sesión
</Button>
              </div>
            </div>
          </div>
        </aside>

        {/* backdrop (mantengo por si luego quieres mobile toggle) */}
        <div className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>

        {/* MAIN CONTENT */}
        <div id="main-content" className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
          <main>
            <div className="pt-6 px-4">
              <div className="w-full min-h-[calc(100vh-230px)]">
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                  {children}
                </div>
              </div>
            </div>
          </main>

          <footer className="bg-white md:flex md:items-center md:justify-between shadow rounded-lg p-4 md:p-6 xl:p-8 my-6 mx-4">
            <ul className="flex items-center flex-wrap mb-6 md:mb-0">
              <li>
                <a href="#" className="text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6">
                  Terms and conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-normal text-gray-500 hover:underline">
                  Contact
                </a>
              </li>
            </ul>
            <div className="flex sm:justify-center space-x-6">
              {/* social icons — puedes quitar si no las necesitas */}
              <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675..." />
              </svg>
            </div>
          </footer>

          <p className="text-center text-sm text-gray-500 my-10">
            &copy; 2019-{new Date().getFullYear()}{" "}
            <a href="#" className="hover:underline" target="_blank" rel="noreferrer">
              Themesberg
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
