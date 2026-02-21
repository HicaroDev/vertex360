
"use client";

import { motion } from "framer-motion";
import {
    Layers,
    Target,
    TrendingUp,
    Zap,
    Rocket,
    Users,
    Presentation,
    Award,
    Activity,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

const productCategories = [
    {
        title: "Assessoria",
        description: "Acompanhamento estratégico completo para transformação empresarial.",
        icon: Rocket,
        items: [
            { name: "Método Vertex 360", description: "Nossa metodologia principal de gestão e crescimento." }
        ],
        color: "bg-brand-slate"
    },
    {
        title: "Consultorias",
        description: "Intervenções técnicas pontuais em áreas críticas do negócio.",
        icon: Target,
        items: [
            { name: "Finanças", description: "Gestão de caixa, DRE e planejamento financeiro." },
            { name: "Processos", description: "Padronização, fluxogramas e eficiência operacional." },
            { name: "Estratégia", description: "Posicionamento de mercado e planos de ação." }
        ],
        color: "bg-brand-gold"
    },
    {
        title: "Educação & Treinamento",
        description: "Capacitação de lideranças e equipes para alta performance.",
        icon: Presentation,
        items: [
            { name: "Mentorias", description: "Acompanhamento individual para executivos." },
            { name: "Cursos", description: "Treinamentos técnicos e comportamentais." },
            { name: "Palestras", description: "Conteúdo motivacional e técnico para eventos." }
        ],
        color: "bg-brand-slate"
    },
    {
        title: "Soluções Personalizadas",
        description: "Tecnologia e ferramentas sob medida para sua necessidade.",
        icon: Activity,
        items: [
            { name: "BI (Business Intelligence)", description: "Dashboards dinâmicos e análise de indicadores em tempo real." }
        ],
        color: "bg-emerald-600"
    }
];

export default function ProductsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-gold">
                        <Layers className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Portfolio de Valor</span>
                    </div>
                    <h1 className="text-5xl font-black text-brand-slate uppercase tracking-tighter">Produtos & Ferramentas</h1>
                    <p className="text-slate-400 text-sm max-w-xl font-medium">
                        Conheça o ecossistema completo de soluções da R&V. Da assessoria estratégica às ferramentas de inteligência de dados.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white border border-brand-slate/10 p-5 flex items-center gap-6 shadow-sm">
                        <div className="p-3 bg-brand-gold/10 text-brand-gold">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nível de Entrega</p>
                            <p className="text-sm font-black text-brand-slate uppercase">Premium Executive</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {productCategories.map((cat, idx) => {
                    const Icon = cat.icon;
                    return (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white border border-brand-slate/5 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]"
                        >
                            <div className={`${cat.color} p-10 text-white relative`}>
                                <div className="absolute top-8 right-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Icon className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 flex items-center gap-3 mb-4">
                                    <Icon className="w-5 h-5 text-brand-gold" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Linha de Serviço</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter relative z-10">{cat.title}</h3>
                                <p className="text-xs text-white/60 mt-4 leading-relaxed max-w-xs relative z-10">
                                    {cat.description}
                                </p>
                            </div>

                            <div className="p-10 flex-1 space-y-8">
                                <div className="space-y-6">
                                    {cat.items.map((item, i) => (
                                        <div key={item.name} className="flex gap-6 group/item">
                                            <div className="mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold group-hover/item:scale-150 transition-transform" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-brand-slate uppercase tracking-tight group-hover/item:text-brand-gold transition-colors">{item.name}</h4>
                                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1 italic">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-brand-slate/5">
                                    <button className="flex items-center gap-3 text-[10px] font-black text-brand-slate uppercase tracking-widest hover:text-brand-gold transition-colors">
                                        Explorar Metodologia <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Footer Info */}
            <div className="bg-brand-slate p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-brand-gold shadow-2xl">
                <div className="flex items-center gap-8">
                    <div className="p-5 bg-white/5 rounded-full ring-1 ring-white/10">
                        <ShieldCheck className="w-10 h-10 text-brand-gold" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter">Selo de Qualidade R&V</h4>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Todas as nossas ferramentas são proprietárias e validadas por mais de 500 empresas.</p>
                    </div>
                </div>
                <button className="bg-brand-gold text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-brand-slate transition-all shadow-xl">
                    Solicitar Customização
                </button>
            </div>
        </div>
    );
}
