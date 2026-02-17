"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    Calendar,
    FileText,
    Home,
    LogOut,
    Settings,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

const menuItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: Calendar, label: "Evolução", href: "/dashboard/timeline" },
    { icon: FileText, label: "Documentos", href: "/dashboard/documents" },
    { icon: BarChart3, label: "Financeiro", href: "/dashboard/finance" },
    { icon: Users, label: "Equipe", href: "/dashboard/team" },
];

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex bg-brand-slate h-full flex-col text-white">
            <div className="p-8">
                <Logo className="invert brightness-0" />
            </div>

            <nav className="flex-1 px-4 py-4">
                <ul className="space-y-2">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <motion.li
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 border-l-2 ${isActive
                                            ? "border-brand-gold bg-white/5 text-brand-gold"
                                            : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium tracking-wide uppercase">
                                        {item.label}
                                    </span>
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-6 border-t border-white/10 space-y-4">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-4 px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-wide">Configurações</span>
                </Link>
                <button
                    className="flex items-center gap-4 px-4 py-2 text-red-400 hover:text-red-300 transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-wide">Sair</span>
                </button>
            </div>
        </div>
    );
}
