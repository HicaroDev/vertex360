
"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Label, RadialBarChart, RadialBar,
    ComposedChart
} from 'recharts';
import {
    TrendingUp, Users, Target, ShieldCheck, Zap,
    Info, ArrowUpRight, ArrowDownRight,
    Layers, MousePointer2, Activity,
    Filter, Search, Calendar, CheckCircle2, AlertCircle,
    ArrowUpDown, SlidersHorizontal
} from 'lucide-react';
import biData from '@/data/bi-data.json';

// Cores do Sistema
const BRAND_GOLD = '#D4AF37';
const BRAND_SLATE = '#1E293B';
const BRAND_CREAM = '#FDFCF8';

type Department = "Finanças" | "Processos" | "Pessoas" | "Comercial" | "ESG";

const depts: { id: Department; label: string; icon: any; categories: string[] }[] = [
    {
        id: "Finanças",
        label: "Financeiro",
        icon: TrendingUp,
        categories: ["Todos", "Resultados", "Liquidez", "Estrutura", "Ciclos"]
    },
    {
        id: "Processos",
        label: "Processos",
        icon: Zap,
        categories: ["Todos", "Produtividade", "Padronização", "Monitoramento"]
    },
    {
        id: "Pessoas",
        label: "Pessoas",
        icon: Users,
        categories: ["Todos", "Estrutura", "Desenvolvimento", "Clima", "Saúde"]
    },
    {
        id: "Comercial",
        label: "Comercial",
        icon: Target,
        categories: ["Todos", "Funil", "Economia", "Sucesso"]
    },
    {
        id: "ESG",
        label: "Governança",
        icon: ShieldCheck,
        categories: ["Todos"]
    },
];

const invertedIndicators = ['churn', 'retrabalho', 'absenteísmo', 'endividamento', 'risco', 'custo', 'pmp', 'pmr', 'cycle', 'lead time', 'perda'];

const getIndicatorStatus = (real: any, prev: any, title: string) => {
    if (typeof real !== 'number' || typeof prev !== 'number') return 'neutral';

    const isMainlyInverted = invertedIndicators.some(word => title.toLowerCase().includes(word));

    if (isMainlyInverted) {
        return real <= prev ? 'positive' : 'negative';
    }
    return real >= prev ? 'positive' : 'negative';
};

const getSubCategory = (dept: Department, indicator: string) => {
    const title = indicator.toLowerCase();
    if (dept === "Finanças") {
        if (title.includes("faturamento") || title.includes("lucro") || title.includes("margem") || title.includes("ebitda")) return "Resultados";
        if (title.includes("liquidez") || title.includes("capacidade")) return "Liquidez";
        if (title.includes("endividamento") || title.includes("alavancagem") || title.includes("composição")) return "Estrutura";
        if (title.includes("giro") || title.includes("prazo") || title.includes("ciclo") || title.includes("equilíbrio")) return "Ciclos";
    }
    if (dept === "Processos") {
        if (title.includes("ciclo") || title.includes("retrabalho") || title.includes("eficiência") || title.includes("produtividade")) return "Produtividade";
        if (title.includes("pop") || title.includes("fluxograma") || title.includes("conformidade")) return "Padronização";
        if (title.includes("kpi") || title.includes("metas") || title.includes("reuniões")) return "Monitoramento";
    }
    if (dept === "Pessoas") {
        if (title.includes("cargos") || title.includes("competências") || title.includes("disc") || title.includes("dossiê") || title.includes("cct")) return "Estrutura";
        if (title.includes("integração") || title.includes("pdi") || title.includes("treinamento") || title.includes("desempenho") || title.includes("retenção")) return "Desenvolvimento";
        if (title.includes("satisfação") || title.includes("confiança") || title.includes("comunicação") || title.includes("clima")) return "Clima";
        if (title.includes("turnover") || title.includes("absenteísmo") || title.includes("custo")) return "Saúde";
    }
    if (dept === "Comercial") {
        if (title.includes("conversão") || title.includes("tempo") || title.includes("meta") || title.includes("crescimento")) return "Funil";
        if (title.includes("ticket") || title.includes("cac") || title.includes("ltv") || title.includes("mercado") || title.includes("vendedor")) return "Economia";
        if (title.includes("retenção") || title.includes("csat") || title.includes("nps") || title.includes("churn")) return "Sucesso";
    }
    return "Geral";
};

export default function CustomDashboard() {
    const [selectedDept, setSelectedDept] = useState<Department>("Finanças");
    const [activeSub, setActiveSub] = useState<string>("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "positive" | "negative">("all");
    const [sortBy, setSortBy] = useState<"name" | "performance">("name");

    const filteredData = useMemo(() => {
        let result = biData.filter(item => item.DEPT === selectedDept);

        if (activeSub !== "Todos") {
            result = result.filter(item => getSubCategory(selectedDept, item.INDICADOR) === activeSub);
        }

        if (searchTerm) {
            result = result.filter(item => item.INDICADOR.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (statusFilter !== "all") {
            result = result.filter(item => getIndicatorStatus(item.REALIZADO, item.PREVISTO, item.INDICADOR) === statusFilter);
        }

        if (sortBy === "name") {
            result.sort((a, b) => a.INDICADOR.localeCompare(b.INDICADOR));
        } else {
            result.sort((a, b) => {
                const perfA = (typeof a.REALIZADO === 'number' && typeof a.PREVISTO === 'number' && a.PREVISTO !== 0) ? (a.REALIZADO / a.PREVISTO) : 0;
                const perfB = (typeof b.REALIZADO === 'number' && typeof b.PREVISTO === 'number' && b.PREVISTO !== 0) ? (b.REALIZADO / b.PREVISTO) : 0;
                return perfB - perfA;
            });
        }

        return result;
    }, [selectedDept, activeSub, searchTerm, statusFilter, sortBy]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
            {/* Top Navigation Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/60 backdrop-blur-xl border border-brand-slate/5 p-4 rounded-[2rem] shadow-sm sticky top-4 z-[40]">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-slate p-3 rounded-2xl shadow-lg">
                        <Activity className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-brand-slate uppercase tracking-tighter leading-none">RV Intelligence</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">BI Center • Ferreira Distribuidora</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {depts.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => { setSelectedDept(d.id); setActiveSub("Todos"); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${selectedDept === d.id
                                    ? 'bg-brand-gold text-white shadow-xl shadow-brand-gold/10'
                                    : 'text-slate-400 hover:text-brand-slate hover:bg-white/50'
                                }`}
                        >
                            <d.icon className="w-3.5 h-3.5" />
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modern Filter Dashboard Control Area */}
            <div className="bg-white/40 border border-brand-slate/5 p-6 rounded-[2.5rem] space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Tabs / Sub-menus */}
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                        {depts.find(d => d.id === selectedDept)?.categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveSub(cat)}
                                className={`relative pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeSub === cat ? 'text-brand-slate' : 'text-slate-400 hover:text-brand-slate'
                                    }`}
                            >
                                {cat}
                                {activeSub === cat && (
                                    <motion.div layoutId="subBar" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Quick Search */}
                    <div className="relative group min-w-[300px]">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-gold transition-colors" />
                        <input
                            type="text"
                            placeholder="Pesquisar indicador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-brand-slate/5 h-12 pl-12 pr-6 rounded-2xl text-[10px] appearance-none font-bold uppercase tracking-widest focus:outline-none focus:border-brand-gold transition-all"
                        />
                    </div>
                </div>

                {/* Advanced Filters Bar */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-slate/5">
                    <div className="flex items-center gap-3">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtros:</span>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex p-1 bg-slate-50 rounded-xl gap-1">
                        {[
                            { id: "all", label: "Todos", icon: Filter },
                            { id: "positive", label: "Metas OK", icon: CheckCircle2 },
                            { id: "negative", label: "Déficit", icon: AlertCircle },
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setStatusFilter(s.id as any)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === s.id ? 'bg-white text-brand-slate shadow-sm' : 'text-slate-400 hover:text-brand-slate'
                                    }`}
                            >
                                <s.icon className="w-3 h-3" />
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort Selector */}
                    <div className="flex p-1 bg-slate-50 rounded-xl gap-1">
                        {[
                            { id: "name", label: "Alfabético", icon: ArrowUpDown },
                            { id: "performance", label: "Performance", icon: TrendingUp },
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSortBy(s.id as any)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sortBy === s.id ? 'bg-white text-brand-slate shadow-sm' : 'text-slate-400 hover:text-brand-slate'
                                    }`}
                            >
                                <s.icon className="w-3 h-3" />
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Exibindo {filteredData.length} resultados
                    </div>
                </div>
            </div>

            {/* Performance Context Info */}
            <div className="flex items-baseline gap-4 px-2">
                <h3 className="text-4xl font-black text-brand-slate tracking-tighter uppercase">{selectedDept}</h3>
                <span className="text-sm font-bold text-brand-gold uppercase tracking-widest">{activeSub !== "Todos" ? `• ${activeSub}` : "• Visão Global"}</span>
            </div>

            {/* Indicators Grid */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredData.map((indicator, idx) => (
                        <IndicatorCard key={`${indicator.INDICADOR}-${idx}`} indicator={indicator} />
                    ))}

                    {filteredData.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="p-10 bg-brand-cream rounded-full">
                                <Search className="w-12 h-12 text-brand-gold/30" />
                            </div>
                            <h4 className="text-lg font-black text-brand-slate uppercase tracking-tight">Nenhum resultado encontrado</h4>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Tente ajustar seus filtros ou termos de pesquisa.</p>
                            <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); setActiveSub("Todos"); }} className="text-brand-gold text-[10px] font-black uppercase hover:underline pt-4">Limpar todos os filtros</button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function IndicatorCard({ indicator }: { indicator: any }) {
    const status = getIndicatorStatus(indicator.REALIZADO, indicator.PREVISTO, indicator.INDICADOR);
    const chartType = indicator.GRÁFICO?.toLowerCase() || 'coluna';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="group relative bg-white border border-brand-slate/5 p-8 rounded-[2.5rem] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700 h-full flex flex-col"
        >
            <div className="flex justify-between items-start mb-10 text-left">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${status === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : status === 'negative' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-300'}`} />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{chartType}</p>
                    </div>
                    <h4 className="text-base font-black text-brand-slate uppercase leading-none tracking-tight group-hover:text-brand-gold transition-colors duration-500 line-clamp-2">
                        {indicator.INDICADOR}
                    </h4>
                </div>
                <div className="p-2.5 bg-slate-50 text-slate-300 rounded-xl group-hover:bg-brand-slate group-hover:text-white transition-all cursor-pointer">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            <div className="flex-1 min-h-[160px] w-full flex items-center justify-center">
                <ModernChart indicator={indicator} status={status} />
            </div>

            <div className="mt-10 pt-8 border-t border-brand-slate/5 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Realizado</span>
                    <p className={`text-xl font-black tracking-tighter ${status === 'positive' ? 'text-brand-slate' : status === 'negative' ? 'text-rose-500' : 'text-brand-slate'}`}>
                        {formatValue(indicator.REALIZADO)}
                    </p>
                </div>
                <div className="text-right space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Previsto</span>
                    <p className="text-xl font-bold text-slate-200 tracking-tighter">
                        {formatValue(indicator.PREVISTO)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function ModernChart({ indicator, status }: { indicator: any; status: any }) {
    const type = indicator.GRÁFICO?.toLowerCase() || 'coluna';
    const chartColor = status === 'positive' ? BRAND_GOLD : status === 'negative' ? '#F43F5E' : '#94A3B8';

    // Fake timeline data
    const data = [
        { name: 'W1', real: (typeof indicator.REALIZADO === 'number' ? indicator.REALIZADO : 0) * 0.8 },
        { name: 'W2', real: (typeof indicator.REALIZADO === 'number' ? indicator.REALIZADO : 0) * 1.1 },
        { name: 'W3', real: (typeof indicator.REALIZADO === 'number' ? indicator.REALIZADO : 0) * 0.95 },
        { name: 'NOW', real: typeof indicator.REALIZADO === 'number' ? indicator.REALIZADO : 0 },
    ];

    if (type.includes('coluna') || type.includes('barra')) {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="real" radius={[10, 10, 10, 10]} barSize={24}>
                        {data.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={i === data.length - 1 ? chartColor : '#F1F5F9'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }

    if (type.includes('linha') || type.includes('area')) {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ left: -20 }}>
                    <defs>
                        <linearGradient id={`grad-${indicator.INDICADOR}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="real" stroke={chartColor} strokeWidth={4} fill={`url(#grad-${indicator.INDICADOR})`} />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    const percentage = Math.min((typeof indicator.REALIZADO === 'number' && typeof indicator.PREVISTO === 'number' && indicator.PREVISTO !== 0) ? (indicator.REALIZADO / indicator.PREVISTO) * 100 : 0, 100);
    const radialData = [{ name: 'val', value: percentage, fill: chartColor }];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={radialData} startAngle={180} endAngle={-180}>
                <RadialBar background dataKey="value" cornerRadius={10} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-brand-slate font-black text-2xl">
                    {percentage.toFixed(0)}%
                </text>
            </RadialBarChart>
        </ResponsiveContainer>
    );
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-brand-slate p-3 border border-white/5 shadow-2xl rounded-2xl">
                <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-1">Nexus Hub</p>
                <p className="text-[11px] font-black text-white">{formatValue(payload[0].value)}</p>
            </div>
        );
    }
    return null;
};

function formatValue(val: any) {
    if (typeof val === 'number') {
        if (Math.abs(val) < 1 && val !== 0) return (val * 100).toFixed(1) + '%';
        if (Math.abs(val) >= 1000) return 'R$ ' + (val / 1000).toFixed(1) + 'k';
        return val.toLocaleString('pt-BR');
    }
    return val;
}
