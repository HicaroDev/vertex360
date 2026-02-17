"use client";

import { motion } from "framer-motion";
import {
    Calendar,
    CheckCircle2,
    Clock,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    TrendingUp,
    Bookmark,
    Target,
    Users,
    Briefcase,
    Zap
} from "lucide-react";
import { useState } from "react";

const events = [
    {
        id: "1",
        title: "Entrega do Relatório de Análise Documental",
        description: "Consolidação de todos os achados da Fase 1 do Diagnóstico Empresarial.",
        date: "12/02/2026",
        type: "Entrega",
        pillar: "Geral",
        status: "Concluído",
        isMilestone: true
    },
    {
        id: "2",
        title: "Reunião de Alinhamento: Estratégia de Precificação",
        description: "Definição das novas margens de contribuição por categoria de produto.",
        date: "10/02/2026",
        type: "Reunião",
        pillar: "Financeiro",
        status: "Concluído",
        isMilestone: false
    },
    {
        id: "3",
        title: "Diagnóstico de Perfil do Cliente - Fase 0",
        description: "Mapeamento inicial de expectativas e dores do negócio.",
        date: "05/02/2026",
        type: "Entrevista",
        pillar: "Estratégico",
        status: "Concluído",
        isMilestone: false
    },
    {
        id: "4",
        title: "Kick-off do Projeto Vertex 360",
        description: "Apresentação da metodologia, cronograma e equipe de consultoria.",
        date: "01/02/2026",
        type: "Reunião",
        pillar: "Geral",
        status: "Concluído",
        isMilestone: true
    },
    {
        id: "5",
        title: "Mapeamento de Processos Comerciais",
        description: "Início do desenho do funil de vendas e jornada do cliente.",
        date: "25/01/2026",
        type: "Atividade",
        pillar: "Comercial",
        status: "Andamento",
        isMilestone: false
    }
];

export default function TimelinePage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs">Jornada de Evolução</h2>
                    <h1 className="text-5xl font-black text-brand-slate uppercase tracking-tighter">Linha do Tempo</h1>
                    <p className="text-slate-400 text-sm max-w-xl">
                        Acompanhe cada passo do Método Vertex 360 na sua empresa. Do diagnóstico à consolidação dos resultados.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white border border-brand-slate/10 p-5 flex items-center gap-6">
                        <div className="p-3 bg-brand-gold/10 text-brand-gold">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Etapa Atual</p>
                            <p className="text-sm font-black text-brand-slate uppercase">Fase 1: Diagnóstico</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline View */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Evolution Progress Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-brand-slate p-8 text-white space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.2em]">Status do Método</h3>
                            <p className="text-2xl font-black italic">Maturidade 72%</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: "Estratégia", active: true },
                                { label: "Financeiro", active: true },
                                { label: "Processos", active: false },
                                { label: "Pessoas", active: false },
                                { label: "Comercial", active: false },
                                { label: "ESG", active: false },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${p.active ? 'text-white' : 'text-slate-500'}`}>{p.label}</span>
                                    {p.active ? <CheckCircle2 className="w-3 h-3 text-brand-gold" /> : <div className="w-3 h-3 border border-slate-700 rounded-full" />}
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 tracking-widest">Próximo Milestone</p>
                            <div className="flex items-center gap-3">
                                <Zap className="w-4 h-4 text-brand-gold" />
                                <span className="text-xs font-bold uppercase">Apresentação Fase 2</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-brand-slate/10 p-8 space-y-6">
                        <h4 className="text-[10px] font-black text-brand-slate uppercase tracking-widest border-b border-brand-slate/5 pb-4">Legenda de Atividades</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 bg-brand-gold rounded-full" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Marco Crítico</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 bg-brand-slate rounded-full" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Entregável Técnico</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Reunião Concluída</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Timeline Thread */}
                <div className="lg:col-span-3">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="relative pl-8 md:pl-12 space-y-12 before:absolute before:left-0 before:top-4 before:bottom-0 before:w-0.5 before:bg-brand-slate/10"
                    >
                        {events.map((event, i) => (
                            <motion.div
                                key={event.id}
                                variants={item}
                                className="relative"
                            >
                                {/* Connector Dot */}
                                <div className={`absolute -left-8 md:-left-12 top-2 w-4 h-4 rounded-full border-4 border-white z-10 ${event.isMilestone ? 'bg-brand-gold w-6 h-6 -left-9 md:-left-[52px]' : 'bg-brand-slate'
                                    } shadow-xl`} />

                                <div className="bg-white p-8 border border-brand-slate/10 hover:shadow-2xl transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[11px] font-black text-brand-gold uppercase tracking-[0.2em]">{event.date}</span>
                                            <span className="px-3 py-1 bg-brand-slate/5 text-brand-slate text-[9px] font-black uppercase tracking-widest">{event.type}</span>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${event.status === 'Concluído' ? 'text-emerald-500' : 'text-amber-500'
                                            }`}>{event.status}</span>
                                    </div>

                                    <h3 className="text-xl font-black text-brand-slate uppercase tracking-tight mb-2 group-hover:text-brand-gold transition-colors">{event.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mb-8">
                                        {event.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-brand-slate/5 text-brand-slate">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5 text-brand-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Pilar: {event.pillar}</span>
                                        </div>
                                        {event.type === 'Entrega' && (
                                            <button className="flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest hover:underline ml-auto">
                                                Acessar Documento <ArrowUpRight className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        {event.type === 'Reunião' && (
                                            <button className="flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest hover:underline ml-auto">
                                                Ver Ata de Reunião <ArrowUpRight className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="text-center pt-8">
                            <button className="text-[10px] font-black text-brand-slate uppercase tracking-widest hover:underline px-8 py-3 border border-brand-slate/10">Carregar histórico anterior</button>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
