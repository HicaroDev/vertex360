"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    FileEdit,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

const adminItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
    { icon: Users, label: "Clientes", href: "/admin/clients" },
    { icon: FileEdit, label: "Motor Vertex (IA)", href: "/admin/ai-engine" },
    { icon: Briefcase, label: "Metodologia", href: "/admin/methodology" },
    { icon: BarChart3, label: "Financeiro RV", href: "/admin/finance" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex bg-brand-slate h-full flex-col text-white">
            <div className="p-8">
                <Logo className="invert brightness-0" />
                <div className="mt-2 px-1">
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">Ambiente Admin</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8">
                <ul className="space-y-2">
                    {adminItems.map((item, index) => {
                        const isActive = pathname.startsWith(item.href);
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
                                    <span className="text-xs font-bold tracking-widest uppercase">
                                        {item.label}
                                    </span>
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-6 border-t border-white/10">
                <button
                    className="flex items-center gap-4 px-4 py-2 text-red-400 hover:text-red-300 transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Sair</span>
                </button>
            </div>
        </div>
    );
}
