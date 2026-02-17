"use client";

import { motion } from "framer-motion";
import {
    FileText,
    Clock,
    AlertTriangle,
    Download,
    Eye,
    Search,
    Filter,
    Lock,
    Loader2,
    Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { getPortalWorkspaces } from "@/lib/database";
import Link from "next/link";

const FERREIRA_CLIENT_ID = '9e4e1fec-2e0a-428d-843b-63bb398e5c09';

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, lastUpdate: '-' });

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await getPortalWorkspaces(FERREIRA_CLIENT_ID);
                setWorkspaces(data);

                // Calcular stats
                let total = 0;
                let pending = 0;
                data.forEach(ws => {
                    total += ws.documents.length;
                    pending += ws.documents.filter((d: any) => d.status === 'analyzing').length;
                });

                setStats({
                    total,
                    pending,
                    lastUpdate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                });
            } catch (error) {
                console.error("Erro ao carregar documentos:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const allDocuments = workspaces.flatMap(ws =>
        ws.documents.map((doc: any) => ({
            ...doc,
            category: ws.folder_name,
            color: ws.color
        }))
    ).filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs">Repositório Vertex</h2>
                    <h1 className="text-4xl font-black text-brand-slate uppercase tracking-tighter">Documentação</h1>
                    <p className="text-slate-400 text-sm max-w-lg">
                        Acesse todos os entregáveis, atas de reunião e relatórios estratégicos desenvolvidos para sua empresa.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-gold transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            className="bg-white border border-brand-slate/10 px-12 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-gold w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total de Documentos", value: stats.total.toString(), icon: FileText, color: "text-brand-gold" },
                    { label: "Última Atualização", value: stats.lastUpdate, icon: Clock, color: "text-emerald-500" },
                    { label: "Aguardando Análise", value: stats.pending.toString().padStart(2, '0'), icon: AlertTriangle, color: "text-amber-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 border border-brand-slate/10 flex items-center gap-6">
                        <div className={`p-4 bg-brand-cream ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-brand-slate leading-none mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Documents List */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="bg-white border border-brand-slate/10 overflow-hidden"
            >
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                        <p className="text-[10px] font-black text-brand-slate uppercase tracking-widest">Carregando Repositório...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-slate text-white">
                                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em]">Documento</th>
                                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] hidden md:table-cell">Pasta</th>
                                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-center">Data</th>
                                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-center">Status</th>
                                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-slate/5">
                                {allDocuments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-slate-400 font-medium text-sm italic">
                                            Nenhum documento encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    allDocuments.map((doc) => (
                                        <motion.tr
                                            key={doc.id}
                                            variants={item}
                                            className="group hover:bg-brand-cream/20 transition-colors"
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 transition-colors ${doc.status === 'published' ? 'bg-brand-cream text-brand-gold group-hover:bg-brand-gold group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        {doc.status === 'published' ? <FileText className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-bold uppercase tracking-wide leading-tight ${doc.status === 'analyzing' ? 'text-slate-400' : 'text-brand-slate'}`}>
                                                            {doc.title}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                                                            {doc.status === 'published' ? 'Disponível para leitura' : 'Privado - Em Análise'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 hidden md:table-cell">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${doc.color || 'text-slate-400'}`}>{doc.category}</span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.last_edit || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest border ${doc.status === 'published'
                                                    ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                                    : 'text-amber-600 bg-amber-50 border-amber-100'
                                                    }`}>
                                                    {doc.status === 'published' ? 'Publicado' : 'Analisando'}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {doc.status === 'published' ? (
                                                        <>
                                                            <button className="p-2 text-slate-400 hover:text-brand-slate hover:bg-white transition-all border border-transparent hover:border-brand-slate/10" title="Visualizar">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 text-slate-400 hover:text-brand-gold hover:bg-white transition-all border border-transparent hover:border-brand-gold/10" title="Download">
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mr-2 flex items-center gap-1">
                                                            <Lock className="w-3 h-3" /> Bloqueado
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Documentation Help */}
            <motion.div variants={item} className="bg-brand-slate p-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase tracking-tight">Não encontrou o que procurava?</h3>
                        <p className="text-slate-400 text-sm max-w-xl">
                            Alguns documentos podem estar em fase de elaboração ou revisão interna pela nossa equipe. Caso precise de algum arquivo urgente, entre em contato direto com seu consultor.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl -mr-32 -mt-32" />
            </motion.div>
        </div>
    );
}
