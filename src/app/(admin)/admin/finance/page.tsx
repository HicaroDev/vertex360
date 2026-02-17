"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    DollarSign,
    CreditCard,
    PieChart,
    ChevronRight
} from "lucide-react";

export default function AdminFinancePage() {
    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-brand-slate uppercase tracking-tight">Financeiro R&V</h2>
                    <p className="text-slate-400 text-sm font-medium">Controle de honorários, contratos e rentabilidade da consultoria.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">Saldo em Carteira</p>
                    <p className="text-3xl font-black text-brand-slate">R$ 142.500,00</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Receita Recorrente (MRR)", value: "R$ 32.400", change: "+12%", icon: DollarSign },
                    { label: "Contratos em Onboarding", value: "04", change: "Fase de Assinatura", icon: CreditCard },
                    { label: "Ticket Médio", value: "R$ 8.500", change: "Ideal", icon: TrendingUp },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-brand-slate/10 p-8 space-y-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-brand-cream text-brand-gold">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{item.change}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                            <p className="text-3xl font-black text-brand-slate mt-1">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white border border-brand-slate/10 p-10 space-y-8">
                    <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest border-b border-brand-slate/5 pb-4 flex items-center gap-3">
                        <BarChart3 className="w-4 h-4 text-brand-gold" /> Projeção de Recebimentos
                    </h3>
                    <div className="space-y-6">
                        {[
                            { month: "Fevereiro", value: "R$ 38.000", status: "80% Recebido" },
                            { month: "Março", value: "R$ 42.000", status: "Projetado" },
                            { month: "Abril", value: "R$ 45.000", status: "Projetado" },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div>
                                    <p className="text-sm font-bold text-brand-slate uppercase">{row.month}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.status}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <p className="text-lg font-black text-brand-slate">{row.value}</p>
                                    <ArrowUpRight className="w-4 h-4 text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-brand-slate p-10 text-white flex flex-col justify-center space-y-6">
                    <PieChart className="w-8 h-8 text-brand-gold" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Rentabilidade por Pilar</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        O pilar de **"Inteligência Financeira"** continua sendo o mais rentável da R&V, representando 45% do faturamento de novos contratos.
                    </p>
                    <button className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
                        Ver Relatório Detalhado <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
