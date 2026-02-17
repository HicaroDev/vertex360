"use client";

import { motion } from "framer-motion";
import {
    Briefcase,
    Map,
    Target,
    ShieldCheck,
    Layers,
    ChevronRight,
    Sparkles
} from "lucide-react";

const pillars = [
    { id: "diagnostico", title: "Diagnóstico e Conformidade", icon: ShieldCheck, status: "Pronto" },
    { id: "processos", title: "Gestão por Processos", icon: Layers, status: "Pronto" },
    { id: "financeiro", title: "Inteligência Financeira", icon: Target, status: "Pronto" },
    { id: "estrategia", title: "Estratégia e Escala", icon: Map, status: "Pronto" },
];

export default function MethodologyPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-brand-slate uppercase tracking-tight">O Motor Vertex 360°</h2>
                    <p className="text-slate-400 text-sm font-medium">Configure as fases e entregáveis da sua metodologia proprietária.</p>
                </div>
                <div className="flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-6 py-2 border border-brand-gold/20">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Metodologia Padrão Ativa</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pillars.map((pillar, idx) => (
                    <motion.div
                        key={pillar.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white border border-brand-slate/10 p-8 space-y-6 group hover:border-brand-gold transition-all"
                    >
                        <div className="w-12 h-12 bg-brand-cream text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-all">
                            <pillar.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest leading-tight">{pillar.title}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{pillar.status}</p>
                        </div>
                        <button className="flex items-center gap-2 text-[9px] font-black text-brand-gold uppercase tracking-widest group-hover:underline">
                            Editar Fluxo <ChevronRight className="w-3 h-3" />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Methodology Visualizer Placeholder */}
            <div className="bg-brand-slate p-12 text-white border-t-8 border-brand-gold">
                <div className="max-w-2xl space-y-6">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Workflow Digital</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Aqui você define quais checklists e formulários Vertex IA aparecem em cada fase.
                        Atualmente, os 4 pilares estão configurados para gerar automaticamente Atas de Reunião e Diagnósticos Preliminares.
                    </p>
                    <div className="pt-8 flex gap-4">
                        <button className="bg-brand-gold text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Configurar Atregáveis</button>
                        <button className="border border-white/20 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all">Templates HTML</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
