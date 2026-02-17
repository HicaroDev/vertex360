"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileText,
    FolderOpen,
    Plus,
    Settings,
    Share2,
    ChevronRight,
    ChevronDown,
    Calendar,
    Users,
    BarChart3,
    Presentation,
    Rocket,
    FileEdit,
    Download,
    Eye,
    Clock,
    AlertTriangle,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Client, Workspace, Document } from "@/lib/supabase";
import { getClientById, getClientWorkspace } from "@/lib/database";
import WorkspaceManager from "@/components/WorkspaceManager";

// Mapeamento de ícones por categoria
const iconMap: Record<string, any> = {
    "Dados Empresa": Users,
    "Reuniões": Calendar,
    "Diagnóstico": BarChart3,
    "Apresentação": Presentation,
    "Desenvolvimento": Rocket,
};

const colorMap: Record<string, string> = {
    "text-blue-500": "text-blue-500",
    "text-emerald-500": "text-emerald-500",
    "text-brand-gold": "text-brand-gold",
    "text-purple-500": "text-purple-500",
    "text-rose-500": "text-rose-500",
};

export default function ClientWorkspacePage() {
    const params = useParams();
    const clientId = params.id as string;

    const [client, setClient] = useState<Client | null>(null);
    const [workspaces, setWorkspaces] = useState<(Workspace & { documents: Document[] })[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

    useEffect(() => {
        loadClientData();
    }, [clientId]);

    async function loadClientData() {
        try {
            setLoading(true);

            // Carregar cliente
            const clientData = await getClientById(clientId);
            setClient(clientData);

            // Carregar workspaces e documentos
            const workspaceData = await getClientWorkspace(clientId);
            setWorkspaces(workspaceData as any);

            // Expandir as primeiras 2 pastas por padrão
            if (workspaceData && workspaceData.length > 0) {
                setExpandedFolders([
                    workspaceData[0]?.folder_name,
                    workspaceData[1]?.folder_name
                ].filter(Boolean));
            }
        } catch (error) {
            console.error('Erro ao carregar dados do cliente:', error);
        } finally {
            setLoading(false);
        }
    }

    const toggleFolder = (folder: string) => {
        if (expandedFolders.includes(folder)) {
            setExpandedFolders(expandedFolders.filter(f => f !== folder));
        } else {
            setExpandedFolders([...expandedFolders, folder]);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
        );
    }

    // Not found state
    if (!client) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-white border border-brand-slate/10 p-20 text-center">
                    <p className="text-slate-400 font-medium">Cliente não encontrado.</p>
                    <Link
                        href="/admin/clients"
                        className="inline-flex items-center gap-2 mt-6 text-brand-gold hover:text-brand-slate transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" /> Voltar para Carteira
                    </Link>
                </div>
            </div>
        );
    }

    const totalDocuments = workspaces.reduce((acc, ws) => acc + (ws.documents?.length || 0), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/clients"
                    className="flex items-center gap-2 text-slate-400 hover:text-brand-slate transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar para Carteira
                </Link>
                <div className="flex items-center gap-3">
                    <WorkspaceManager
                        clientId={clientId}
                        workspaces={workspaces}
                        onWorkspacesChange={loadClientData}
                    />
                    <button className="p-3 border border-brand-slate/10 text-slate-400 hover:text-brand-slate transition-all bg-white">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-3 border border-brand-slate/10 text-slate-400 hover:text-brand-slate transition-all bg-white">
                        <Settings className="w-4 h-4" />
                    </button>
                    <Link
                        href={`/admin/clients/${params.id}/documents/new`}
                        className="bg-brand-gold text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-slate transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Novo Documento
                    </Link>
                </div>
            </div>

            {/* Client Header */}
            <div className="bg-white border border-brand-slate/10 p-10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${client.health === 'Ideal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                {client.health}
                            </span>
                            {client.since && (
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    Desde {client.since}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl font-black text-brand-slate uppercase tracking-tight">
                            {client.name}
                        </h1>
                        <p className="text-brand-gold font-bold text-xs uppercase tracking-widest">{client.company}</p>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="text-center">
                            <p className="text-3xl font-black text-brand-slate">{client.progress}%</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Progresso</p>
                        </div>
                        {client.next_meeting && (
                            <div className="border-l border-brand-slate/10 pl-10 space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próxima Reunião</p>
                                <p className="text-sm font-bold text-brand-slate">{client.next_meeting}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cream/30 blur-3xl -mr-32 -mt-32" />
            </div>

            {/* Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Workspace Navigation - Notion Style */}
                <div className="lg:col-span-3 bg-white border border-brand-slate/10">
                    <div className="p-8 border-b border-brand-slate/5 flex items-center justify-between">
                        <h2 className="text-xs font-black text-brand-slate uppercase tracking-widest flex items-center gap-3">
                            <FolderOpen className="w-4 h-4 text-brand-gold" /> Workspace do Cliente
                        </h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {workspaces.length} Pastas • {totalDocuments} Documentos
                        </span>
                    </div>

                    {/* Empty State */}
                    {workspaces.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-slate-400 font-medium">Nenhum workspace criado ainda.</p>
                        </div>
                    )}

                    {/* Workspaces List */}
                    <div className="p-6 space-y-2">
                        {workspaces.map((workspace) => {
                            const isExpanded = expandedFolders.includes(workspace.folder_name);

                            // Determinar ícone baseado no nome da pasta
                            let Icon = FolderOpen;
                            for (const [key, value] of Object.entries(iconMap)) {
                                if (workspace.folder_name.includes(key)) {
                                    Icon = value;
                                    break;
                                }
                            }

                            const color = colorMap[workspace.color] || "text-brand-gold";

                            return (
                                <div key={workspace.id}>
                                    {/* Folder Header */}
                                    <button
                                        onClick={() => toggleFolder(workspace.folder_name)}
                                        className="w-full flex items-center gap-3 p-4 hover:bg-brand-cream/20 transition-colors group"
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        )}
                                        <Icon className={`w-5 h-5 ${color}`} />
                                        <span className="text-sm font-bold text-brand-slate uppercase tracking-wide">
                                            {workspace.folder_name}
                                        </span>
                                        <span className="ml-auto text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(workspace.documents?.length || 0)} itens
                                        </span>
                                    </button>

                                    {/* Folder Items */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="ml-6 pl-6 border-l-2 border-brand-slate/5 space-y-1 mt-1"
                                        >
                                            {(!workspace.documents || workspace.documents.length === 0) && (
                                                <div className="p-3 text-slate-400 text-xs">
                                                    Nenhum documento nesta pasta.
                                                </div>
                                            )}
                                            {workspace.documents?.map((doc) => (
                                                <Link
                                                    key={doc.id}
                                                    href={`/admin/clients/${params.id}/documents/${doc.id}`}
                                                    className="flex items-center justify-between p-3 hover:bg-brand-cream/10 transition-colors group cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-4 h-4 text-slate-300 group-hover:text-brand-gold transition-colors" />
                                                        <span className="text-xs font-medium text-brand-slate">{doc.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {doc.last_edit || 'Sem edição'}
                                                        </span>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    window.open(`/admin/clients/${params.id}/documents/${doc.id}`, '_blank');
                                                                }}
                                                                className="p-1.5 text-slate-400 hover:text-brand-slate transition-colors"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}

                                            {/* Botão de Criar Novo Documento */}
                                            <Link
                                                href={`/admin/clients/${params.id}/documents/new?workspace=${encodeURIComponent(workspace.folder_name)}`}
                                                className="flex items-center gap-2 p-3 text-brand-gold hover:bg-brand-cream/20 transition-colors text-xs font-bold uppercase tracking-widest mt-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Novo Documento
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar: Quick Stats */}
                <div className="space-y-8">
                    {/* Next Meeting */}
                    {client.next_meeting && (
                        <div className="bg-brand-slate p-6 text-white space-y-4">
                            <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">Próximo Compromisso</h4>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-brand-gold" />
                                <div>
                                    <p className="text-lg font-black">{client.next_meeting}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Acompanhamento</p>
                                </div>
                            </div>
                            <button className="w-full bg-brand-gold text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-slate transition-all">
                                Agendar Nova
                            </button>
                        </div>
                    )}

                    {/* Stats Card */}
                    <div className="bg-white border border-brand-slate/10 p-6 space-y-4">
                        <h4 className="text-[10px] font-black text-brand-slate uppercase tracking-widest pb-3 border-b border-brand-slate/5">
                            Estatísticas
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspaces</span>
                                <span className="text-lg font-black text-brand-slate">{workspaces.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documentos</span>
                                <span className="text-lg font-black text-brand-slate">{totalDocuments}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progresso</span>
                                <span className="text-lg font-black text-brand-gold">{client.progress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-brand-slate/10 p-6 space-y-4">
                        <h4 className="text-[10px] font-black text-brand-slate uppercase tracking-widest pb-3 border-b border-brand-slate/5">Ações Rápidas</h4>
                        <Link
                            href="/admin/ai-engine"
                            className="flex items-center justify-between p-3 bg-brand-cream hover:bg-brand-gold hover:text-white transition-all group"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest">Motor Vertex IA</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
