"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Activity,
    AlertCircle,
    Info,
    Calendar,
    ChevronDown,
    ArrowRight
} from "lucide-react";

export default function FinancePage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs">Visão Estratégica</h2>
                    <h1 className="text-5xl font-black text-brand-slate uppercase tracking-tighter">Financeiro</h1>
                    <p className="text-slate-400 text-sm max-w-xl">
                        Análise de performance, indicadores de lucratividade e saúde do caixa consolidada pelo Método Vertex 360.
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white border border-brand-slate/10 p-3 flex items-center gap-4">
                        <Calendar className="w-4 h-4 text-brand-gold" />
                        <span className="text-[10px] font-bold text-brand-slate uppercase tracking-widest">Jan / 2026 - Dez / 2026</span>
                        <ChevronDown className="w-3 h-3 text-slate-300" />
                    </div>
                </div>
            </div>

            {/* KPI Row */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: "Receita Líquida", value: "R$ 482.500", trend: "+12%", status: "up", info: "Acumulado do mês" },
                    { label: "Margem de Contribuição", value: "42.5%", trend: "+3%", status: "up", info: "Média por produto" },
                    { label: "Ponto de Equilíbrio", value: "R$ 310k", trend: "-2%", status: "down", info: "Redução de custos fixos" },
                    { label: "Lucratividade", value: "18.2%", trend: "+5%", status: "up", info: "Net Profit" },
                ].map((kpi, i) => (
                    <motion.div key={i} variants={item} className="bg-white p-8 border border-brand-slate/10 group hover:border-brand-gold transition-colors relative overflow-hidden">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</p>
                        <div className="flex items-end justify-between mt-4">
                            <span className="text-2xl font-black text-brand-slate">{kpi.value}</span>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${kpi.status === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {kpi.status === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {kpi.trend}
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 p-2 -mx-2">
                            <Info className="w-3 h-3" /> {kpi.info}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts & Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Main Analysis Panel */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white border border-brand-slate/10">
                        <div className="p-8 border-b border-brand-slate/5 flex items-center justify-between">
                            <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest flex items-center gap-3">
                                <Activity className="w-4 h-4 text-brand-gold" /> Fluxo de Caixa Operacional
                            </h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-brand-slate" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase uppercase">Entradas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-brand-gold" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Saídas</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-12 h-[400px] flex items-end justify-between gap-4">
                            {/* Mock Chart Bars */}
                            {[60, 45, 80, 55, 90, 75, 40, 85, 95, 65, 50, 70].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-full flex flex-col gap-0.5 items-center justify-end h-[300px]">
                                        <div
                                            className="w-full bg-brand-slate/10 group-hover:bg-brand-slate transition-all relative"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-slate opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div
                                            className="w-full bg-brand-gold/20 group-hover:bg-brand-gold transition-all relative"
                                            style={{ height: `${h * 0.7}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                        {['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Insights */}
                    <div className="bg-brand-slate p-12 text-white overflow-hidden relative group">
                        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-12">
                            <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-3">
                                    <Target className="w-5 h-5 text-brand-gold" />
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">Parecer da Consultoria Vertex</h4>
                                </div>
                                <p className="text-lg font-bold leading-relaxed italic text-white/90">
                                    "Identificamos uma oportunidade de redução de 12% nos custos variáveis através da renegociação com fornecedores de insumos principais. A saúde operacional é positiva, mas requer atenção no prazo médio de recebimento."
                                </p>
                                <button className="flex items-center gap-3 text-brand-gold text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                                    Ver Análise Completa de DRE <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-8 space-y-4 shrink-0 w-full md:w-64">
                                <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Score de Solvência</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black">AA</span>
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Excelente</span>
                                </div>
                                <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[85%]" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 blur-3xl -mr-48 -mt-48 transition-colors group-hover:bg-brand-gold/10" />
                    </div>
                </div>

                {/* Vertical Panels */}
                <div className="space-y-10">
                    {/* Cost Distribution */}
                    <div className="bg-white border border-brand-slate/10 p-8 space-y-8">
                        <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest flex items-center gap-3 border-b border-brand-slate/5 pb-6">
                            <PieChart className="w-4 h-4 text-brand-gold" /> Distribuição de Custos
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: "CPV / CMV", value: "45%", color: "bg-brand-slate" },
                                { label: "Folha / RH", value: "22%", color: "bg-brand-gold" },
                                { label: "Marketing / Vendas", value: "12%", color: "bg-brand-cream border border-brand-slate/10" },
                                { label: "Administrativo", value: "8%", color: "bg-slate-200" },
                                { label: "Outros", value: "13%", color: "bg-slate-50" },
                            ].map((cost, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{cost.label}</span>
                                        <span className="text-brand-slate">{cost.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 overflow-hidden">
                                        <div className={`h-full ${cost.color}`} style={{ width: cost.value }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts / Risks */}
                    <div className="bg-amber-50 border border-amber-200 p-8 space-y-4">
                        <div className="flex items-center gap-3 text-amber-600">
                            <AlertCircle className="w-5 h-5" />
                            <h4 className="font-bold text-xs uppercase tracking-widest text-amber-900">Riscos em Monitoramento</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/50 border border-amber-200/50">
                                <p className="text-[11px] font-bold text-amber-900 uppercase">Impacto Tributário</p>
                                <p className="text-[10px] text-amber-800/70 mt-1 leading-relaxed">Avaliar mudança de regime tributário para o próximo semestre devido ao aumento de faturamento.</p>
                            </div>
                            <div className="p-4 bg-white/50 border border-amber-200/50">
                                <p className="text-[11px] font-bold text-amber-900 uppercase">Custo de Insumos</p>
                                <p className="text-[10px] text-amber-800/70 mt-1 leading-relaxed">Vulnerabilidade a flutuações cambiais em 15% da base de fornecedores.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
