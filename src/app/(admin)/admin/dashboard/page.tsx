"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    ChevronRight,
    Loader2,
    TrendingUp,
    FileText,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import type { Client } from "@/lib/supabase";

export default function AdminDashboard() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            setLoading(true);
            const { getClients } = await import('@/lib/database');
            const data = await getClients();
            setClients(data);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    }

    // Calcular estatísticas
    const stats = {
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status === 'Ativo').length,
        criticalClients: clients.filter(c => c.health === 'Crítico').length,
        healthyClients: clients.filter(c => c.health === 'Ideal').length,
        attentionClients: clients.filter(c => c.health === 'Atenção').length,
    };

    // Filtrar clientes
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Clientes recentes (últimos 3)
    const recentClients = filteredClients.slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Search & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-brand-slate uppercase tracking-tight">Gestão de Clientes</h2>
                    <p className="text-slate-400 text-sm font-medium">
                        Bem-vinda de volta, Stela. Você tem {stats.activeClients} projetos ativos hoje.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-brand-slate/10 pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-brand-gold w-64"
                        />
                    </div>
                    <Link
                        href="/admin/clients"
                        className="bg-brand-gold text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-brand-slate transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Novo Cliente
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                </div>
            )}

            {/* Dashboard Content */}
            {!loading && (
                <>
                    {/* Command Center Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {
                                label: "Total de Clientes",
                                value: stats.totalClients.toString(),
                                color: "bg-brand-slate",
                                trend: `${stats.activeClients} ativos`,
                                icon: Users
                            },
                            {
                                label: "Críticos",
                                value: stats.criticalClients.toString(),
                                color: "bg-red-600",
                                trend: "Clientes",
                                icon: AlertCircle
                            },
                            {
                                label: "Saúde Ideal",
                                value: stats.healthyClients.toString(),
                                color: "bg-emerald-600",
                                trend: "Clientes",
                                icon: FileText
                            },
                            {
                                label: "Requer Atenção",
                                value: stats.attentionClients.toString(),
                                color: "bg-amber-600",
                                trend: "Clientes",
                                icon: AlertCircle
                            },
                        ].map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`${stat.color} p-8 text-white flex flex-col justify-between h-44 shadow-xl border-b-4 border-white/10 relative overflow-hidden`}
                                >
                                    <div className="absolute top-4 right-4 opacity-10">
                                        <Icon className="w-16 h-16" />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 relative z-10">{stat.label}</p>
                                    <div className="relative z-10">
                                        <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest mt-2 text-white/40">{stat.trend}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main: Monitoring */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white border border-brand-slate/10">
                                <div className="p-8 border-b border-brand-slate/5 flex items-center justify-between">
                                    <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest">Acompanhamento em Tempo Real</h3>
                                    <Link href="/admin/clients" className="text-[10px] font-black text-brand-gold uppercase tracking-widest hover:underline">Ver Todos</Link>
                                </div>

                                {/* Empty State */}
                                {recentClients.length === 0 && (
                                    <div className="p-20 text-center">
                                        <p className="text-slate-400 font-medium">Nenhum cliente cadastrado ainda.</p>
                                        <Link
                                            href="/admin/clients"
                                            className="inline-flex items-center gap-2 mt-6 text-brand-gold hover:text-brand-slate transition-colors text-xs font-bold uppercase tracking-widest"
                                        >
                                            <Plus className="w-4 h-4" /> Adicionar Primeiro Cliente
                                        </Link>
                                    </div>
                                )}

                                {/* Clients Table */}
                                {recentClients.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-brand-cream/30">
                                                    <th className="p-6 text-[9px] font-black text-brand-slate uppercase tracking-widest">Empresa</th>
                                                    <th className="p-6 text-[9px] font-black text-brand-slate uppercase tracking-widest">Segmento</th>
                                                    <th className="p-6 text-[9px] font-black text-brand-slate uppercase tracking-widest">Progresso</th>
                                                    <th className="p-6 text-[9px] font-black text-brand-slate uppercase tracking-widest">Saúde</th>
                                                    <th className="p-6 text-[9px] font-black text-brand-slate uppercase tracking-widest text-right">Ação</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-brand-slate/5">
                                                {recentClients.map((client) => (
                                                    <tr key={client.id} className="group hover:bg-brand-cream/20 transition-colors">
                                                        <td className="p-6">
                                                            <p className="text-xs font-bold text-brand-slate uppercase">{client.name}</p>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{client.company}</span>
                                                        </td>
                                                        <td className="p-6">
                                                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                                                {client.segment || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1 h-1 bg-slate-100 max-w-[100px] overflow-hidden">
                                                                    <div className="h-full bg-brand-gold" style={{ width: `${client.progress}%` }} />
                                                                </div>
                                                                <span className="text-[10px] font-black text-brand-slate">{client.progress}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-widest ${client.health === 'Ideal' ? 'text-emerald-600 bg-emerald-50' :
                                                                client.health === 'Atenção' ? 'text-amber-600 bg-amber-50' :
                                                                    'text-red-600 bg-red-50'
                                                                }`}>
                                                                {client.health}
                                                            </span>
                                                        </td>
                                                        <td className="p-6 text-right">
                                                            <Link
                                                                href={`/admin/clients/${client.id}`}
                                                                className="inline-flex items-center gap-2 text-slate-300 hover:text-brand-gold transition-colors"
                                                            >
                                                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100">Ver</span>
                                                                <ChevronRight className="w-4 h-4" />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar: Quick Info */}
                        <div className="space-y-8">
                            {/* Motor Vertex IA */}
                            <div className="bg-brand-slate p-8 text-white space-y-6">
                                <Users className="w-6 h-6 text-brand-gold" />
                                <h4 className="text-sm font-black uppercase tracking-widest leading-tight">Motor Vertex IA</h4>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                    Sistema de análise inteligente pronto para processar dados dos seus clientes.
                                </p>
                                <Link
                                    href="/admin/ai-engine"
                                    className="block w-full text-center bg-brand-gold text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-brand-slate transition-all"
                                >
                                    Acessar Motor IA
                                </Link>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white border border-brand-slate/10 p-8 space-y-6">
                                <h4 className="text-[10px] font-black text-brand-slate uppercase tracking-widest border-b border-brand-slate/5 pb-4">
                                    Resumo Rápido
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                                        <span className="text-xl font-black text-brand-slate">{stats.totalClients}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ativos</span>
                                        <span className="text-xl font-black text-emerald-600">{stats.activeClients}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Críticos</span>
                                        <span className="text-xl font-black text-red-600">{stats.criticalClients}</span>
                                    </div>
                                </div>
                                <Link
                                    href="/admin/clients"
                                    className="block w-full text-center bg-brand-cream text-brand-slate py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all"
                                >
                                    Ver Carteira Completa
                                </Link>
                            </div>

                            {/* Methodology Link */}
                            <div className="bg-white border border-brand-slate/10 p-8 space-y-4">
                                <h4 className="text-[10px] font-black text-brand-slate uppercase tracking-widest border-b border-brand-slate/5 pb-4">
                                    Acesso Rápido
                                </h4>
                                <Link
                                    href="/admin/methodology"
                                    className="flex items-center justify-between p-3 bg-brand-cream hover:bg-brand-gold hover:text-white transition-all group"
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-widest">R&V Skills</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/admin/finance"
                                    className="flex items-center justify-between p-3 bg-brand-cream hover:bg-brand-gold hover:text-white transition-all group"
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Financeiro</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
