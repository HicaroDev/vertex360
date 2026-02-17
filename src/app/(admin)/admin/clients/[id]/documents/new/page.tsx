"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DocumentEditor from "@/components/DocumentEditor";
import { getClientWorkspace, createDocument } from "@/lib/database";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function NewDocumentPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const clientId = params.id as string;
    const initialWorkspace = searchParams.get('workspace');

    const [title, setTitle] = useState("Novo Documento");
    const [workspace, setWorkspace] = useState(initialWorkspace || "");
    const [availableWorkspaces, setAvailableWorkspaces] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

    useEffect(() => {
        loadWorkspaces();
    }, [clientId]);

    async function loadWorkspaces() {
        try {
            setLoadingWorkspaces(true);
            const workspaces = await getClientWorkspace(clientId);
            setAvailableWorkspaces(workspaces);

            // Se não veio da URL, pega a primeira pasta disponível
            if (!initialWorkspace && workspaces.length > 0) {
                setWorkspace(workspaces[0].folder_name);
            }
        } catch (error) {
            console.error('Erro ao carregar workspaces:', error);
        } finally {
            setLoadingWorkspaces(false);
        }
    }

    async function handleSave(content: any) {
        try {
            setIsSaving(true);

            if (documentId) {
                // Atualizar documento existente
                const { updateDocument } = await import('@/lib/database');
                await updateDocument(documentId, { content, title });
            } else {
                // Criar novo documento
                const doc = await createDocument({
                    client_id: clientId,
                    category: workspace,
                    title,
                    content,
                    status: 'draft'
                });
                setDocumentId(doc.id);
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar documento. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href={`/admin/clients/${clientId}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-brand-slate transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>

                <div className="flex items-center gap-4">
                    {isSaving && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Salvando...</span>
                        </div>
                    )}
                    <button
                        onClick={() => router.push(`/admin/clients/${clientId}`)}
                        className="bg-brand-slate text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors"
                    >
                        Concluir
                    </button>
                </div>
            </div>

            {/* Document Info */}
            <div className="bg-white border border-brand-slate/10 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Título */}
                    <div>
                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                            Título do Documento
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                            placeholder="Ex: Ata de Reunião - 15/02/2026"
                        />
                    </div>

                    {/* Workspace */}
                    <div>
                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                            Workspace (Pasta de Destino)
                        </label>
                        {loadingWorkspaces ? (
                            <div className="flex items-center gap-2 py-3 text-xs text-slate-400">
                                <Loader2 className="w-3 h-3 animate-spin" /> Carregando pastas...
                            </div>
                        ) : (
                            <select
                                value={workspace}
                                onChange={(e) => setWorkspace(e.target.value)}
                                className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold bg-slate-50 font-medium"
                            >
                                {availableWorkspaces.length === 0 && (
                                    <option value="">Nenhuma pasta disponível</option>
                                )}
                                {availableWorkspaces.map(ws => (
                                    <option key={ws.id} value={ws.folder_name}>
                                        {ws.folder_name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            O documento será salvo nesta pasta do workspace.
                        </p>
                    </div>
                </div>
            </div>

            {/* Editor */}
            <DocumentEditor
                documentId={documentId || undefined}
                clientId={clientId}
                workspaceId={workspace}
                onSave={handleSave}
                autoSave={true}
            />
        </div>
    );
}
