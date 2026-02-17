"use client";

import { motion } from "framer-motion";
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    TrendingUp,
    AlertCircle,
    FileText,
    ChevronRight,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { getPortalWorkspaces } from "@/lib/database";

const FERREIRA_CLIENT_ID = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

export default function DashboardPage() {
    const [recentDeliveries, setRecentDeliveries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const workspaces = await getPortalWorkspaces(FERREIRA_CLIENT_ID);

                // Flatten and sort by last_edit
                const allDocs = workspaces.flatMap(ws =>
                    ws.documents.map((doc: any) => ({
                        ...doc,
                        folder_name: ws.folder_name,
                        color: ws.color
                    }))
                ).sort((a, b) => {
                    // Ordenação simples por data (as datas estão em formato pt-BR no last_edit, 
                    // ideally deveríamos usar created_at/updated_at do banco)
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }).slice(0, 5);

                setRecentDeliveries(allDocs);
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-12 pb-20"
        >
            {/* Hero Section / Score */}
            <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-brand-slate text-white p-10 flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs mb-4">Maturidade Empresarial</h2>
                        <div className="flex items-baseline gap-4">
                            <span className="text-7xl font-black tracking-tighter">72<span className="text-brand-gold uppercase text-2xl">%</span></span>
                            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 text-xs font-bold uppercase tracking-wide">
                                <TrendingUp className="w-4 h-4" />
                                <span>+12%</span>
                            </div>
                        </div>
                        <p className="text-slate-400 mt-6 max-w-md text-sm leading-relaxed">
                            O diagnóstico Vertex 360 aponta uma saúde financeira sólida, com necessidade de refinamento nos processos de RH e Controles Internos.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl -mr-20 -mt-20 group-hover:bg-brand-gold/10 transition-colors duration-700" />
                    <div className="relative z-10 mt-10">
                        <button className="flex items-center gap-2 border border-brand-gold px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all">
                            Ver Diagnóstico Completo <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-brand-slate/10 p-10 space-y-8">
                    <div>
                        <h3 className="text-xs font-bold text-brand-slate uppercase tracking-widest mb-4">Próximos Passos</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 group">
                                <div className="w-6 h-6 border-2 border-brand-gold flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-brand-slate font-bold text-sm uppercase">Revisão do Fluxo de Caixa</p>
                                    <p className="text-slate-400 text-xs mt-1">Prazo: 22 de Fev</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 opacity-50">
                                <div className="w-6 h-6 border-2 border-slate-300 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-brand-slate font-bold text-sm uppercase">Treinamento de Equipe</p>
                                    <p className="text-slate-400 text-xs mt-1">Concluído</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-4 border-2 border-brand-slate text-brand-slate text-xs font-black uppercase tracking-widest hover:bg-brand-slate hover:text-white transition-all">
                        Ir para Agenda
                    </button>
                </div>
            </motion.section>

            {/* Evolution Timeline */}
            <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-brand-slate uppercase tracking-[0.2em]">Últimas Entregas (Timeline)</h3>
                        <button className="text-[10px] font-bold text-brand-gold uppercase hover:underline">Ver Histórico</button>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="p-10 flex flex-col items-center justify-center gap-4 bg-white/50 border border-brand-slate/10">
                                <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                                <p className="text-[9px] font-black text-brand-slate uppercase tracking-widest">Sincronizando entregas...</p>
                            </div>
                        ) : recentDeliveries.length === 0 ? (
                            <div className="p-10 text-center bg-white border border-brand-slate/10 italic text-slate-400 text-sm">
                                Nenhuma entrega recente encontrada.
                            </div>
                        ) : (
                            recentDeliveries.map((doc, idx) => (
                                <div key={doc.id} className="bg-white p-6 border-l-4 border-brand-gold hover:shadow-xl transition-shadow flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-3 transition-colors ${doc.status === 'published' ? 'bg-brand-cream text-brand-gold group-hover:bg-brand-gold group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-brand-slate font-bold uppercase text-sm tracking-wide">{doc.title}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                <span>{doc.last_edit || 'Recente'}</span>
                                                <span>•</span>
                                                <span>{doc.folder_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-widest border ${doc.status === 'published' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                                            {doc.status === 'published' ? 'Publicado' : 'Analisando'}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-brand-slate uppercase tracking-[0.2em]">Sua Equipe R&V</h3>
                    <div className="p-6 bg-white border border-brand-slate/10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200" />
                            <div>
                                <p className="text-xs font-bold text-brand-slate uppercase">Stela Rodrigues</p>
                                <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider">Estrategista</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200" />
                            <div>
                                <p className="text-xs font-bold text-brand-slate uppercase">Raiane Vieira</p>
                                <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider">Controladoria</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-brand-gold py-4 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-slate transition-colors">
                        Agendar Suporte
                    </button>
                </div>
            </motion.section>

            {/* KPI Grid */}
            <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: TrendingUp, label: "Evolução de Lucro", value: "R$ 42k", trend: "+15%" },
                    { icon: AlertCircle, label: "Inadimplência", value: "8%", trend: "-2%" },
                    { icon: CheckCircle2, label: "Processos OK", value: "85%", trend: "+5%" },
                    { icon: Clock, label: "Horas Consultoria", value: "12h", trend: "/mês" }
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white p-8 border border-brand-slate/10 hover:border-brand-gold transition-colors">
                        <kpi.icon className="w-6 h-6 text-brand-gold mb-6" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                        <div className="flex items-baseline justify-between mt-2">
                            <span className="text-2xl font-black text-brand-slate">{kpi.value}</span>
                            <span className={`text-[10px] font-bold uppercase ${kpi.trend.includes('+') ? 'text-emerald-500' : 'text-amber-500'}`}>{kpi.trend}</span>
                        </div>
                    </div>
                ))}
            </motion.section>
        </motion.div>
    );
}
