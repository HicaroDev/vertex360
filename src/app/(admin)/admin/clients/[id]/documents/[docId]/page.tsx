"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DocumentEditor from "@/components/DocumentEditor";
import ShareDocumentModal from "@/components/ShareDocumentModal";
import { getDocumentById, updateDocument, deleteDocument, logActivity, getClientWorkspace } from "@/lib/database";
import { ArrowLeft, Loader2, Trash2, Share2, FolderOpen } from "lucide-react";
import Link from "next/link";

export default function EditDocumentPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;
    const docId = params.docId as string;

    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [availableWorkspaces, setAvailableWorkspaces] = useState<any[]>([]);
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

    useEffect(() => {
        loadDocument();
        loadWorkspaces();
    }, [docId]);

    async function loadWorkspaces() {
        try {
            setLoadingWorkspaces(true);
            const workspaces = await getClientWorkspace(clientId);
            setAvailableWorkspaces(workspaces);
        } catch (error) {
            console.error('Erro ao carregar workspaces:', error);
        } finally {
            setLoadingWorkspaces(false);
        }
    }

    async function loadDocument() {
        try {
            setLoading(true);
            const doc = await getDocumentById(docId);
            setDocument(doc);
        } catch (error) {
            console.error('Erro ao carregar documento:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(content: any) {
        try {
            setIsSaving(true);
            await updateDocument(docId, { content });
            // Registrar atividade
            await logActivity(clientId, 'document_updated', 'document', docId, { title: document.title });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar documento. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        try {
            await deleteDocument(docId);
            router.push(`/admin/clients/${clientId}`);
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir documento. Tente novamente.');
        }
    }

    async function handleTitleChange(newTitle: string) {
        try {
            await updateDocument(docId, { title: newTitle });
            setDocument({ ...document, title: newTitle });
            // Atualizar atividade
            await logActivity(clientId, 'document_updated', 'document', docId, { title: newTitle });
        } catch (error) {
            console.error('Erro ao atualizar título:', error);
        }
    }

    async function handleWorkspaceChange(newWorkspace: string) {
        try {
            setIsSaving(true);
            await updateDocument(docId, { category: newWorkspace });
            setDocument({ ...document, category: newWorkspace });
            // Registrar mudança de pasta
            await logActivity(clientId, 'document_moved', 'document', docId, {
                title: document.title,
                new_workspace: newWorkspace
            });
        } catch (error) {
            console.error('Erro ao atualizar workspace:', error);
            alert('Erro ao mover documento.');
        } finally {
            setIsSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
        );
    }

    if (!document) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-white border border-brand-slate/10 p-20 text-center">
                    <p className="text-slate-400 font-medium">Documento não encontrado.</p>
                    <Link
                        href={`/admin/clients/${clientId}`}
                        className="inline-flex items-center gap-2 mt-6 text-brand-gold hover:text-brand-slate transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </Link>
                </div>
            </div>
        );
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

                <div className="flex items-center gap-3">
                    {isSaving && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Salvando...</span>
                        </div>
                    )}

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-3 border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                        title="Excluir documento"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => setShowShareModal(true)}
                        className="p-3 border border-brand-slate/10 text-slate-400 hover:text-brand-slate transition-all bg-white"
                        title="Compartilhar"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => router.push(`/admin/clients/${clientId}`)}
                        className="bg-brand-gold text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-slate transition-colors"
                    >
                        Concluir
                    </button>
                </div>
            </div>

            {/* Document Info */}
            <div className="bg-white border border-brand-slate/10 p-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Título */}
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                            Título do Documento
                        </label>
                        <input
                            type="text"
                            value={document.title}
                            onChange={(e) => setDocument({ ...document, title: e.target.value })}
                            onBlur={(e) => handleTitleChange(e.target.value)}
                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                        />
                    </div>

                    {/* Workspace */}
                    <div>
                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2 flex items-center gap-2">
                            <FolderOpen className="w-3 h-3" /> Pasta (Workspace)
                        </label>
                        {loadingWorkspaces ? (
                            <div className="flex items-center gap-2 py-3 text-xs text-slate-400">
                                <Loader2 className="w-3 h-3 animate-spin" /> ...
                            </div>
                        ) : (
                            <select
                                value={document.category}
                                onChange={(e) => handleWorkspaceChange(e.target.value)}
                                className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold bg-slate-50 font-medium"
                            >
                                {availableWorkspaces.map(ws => (
                                    <option key={ws.id} value={ws.folder_name}>
                                        {ws.folder_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status */}
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                            Status
                        </label>
                        <select
                            value={document.status || 'draft'}
                            onChange={async (e) => {
                                await updateDocument(docId, { status: e.target.value });
                                setDocument({ ...document, status: e.target.value });
                            }}
                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold bg-slate-50 font-medium"
                        >
                            <option value="draft">Rascunho</option>
                            <option value="analyzing">Analisando</option>
                            <option value="published">Publicado</option>
                            <option value="archived">Arquivado</option>
                        </select>
                    </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-6 pt-4 border-t border-brand-slate/5">
                    <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Workspace:</span>
                        <span className="ml-2 text-xs font-medium text-brand-slate">{document.category}</span>
                    </div>
                    <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Última edição:</span>
                        <span className="ml-2 text-xs font-medium text-brand-slate">{document.last_edit}</span>
                    </div>
                    {document.created_by && (
                        <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Criado por:</span>
                            <span className="ml-2 text-xs font-medium text-brand-slate">{document.created_by}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor */}
            <DocumentEditor
                documentId={docId}
                clientId={clientId}
                workspaceId={document.category}
                initialContent={document.content}
                onSave={handleSave}
                autoSave={true}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full p-8 space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-brand-slate uppercase tracking-tight">
                                Excluir Documento?
                            </h3>
                            <p className="text-sm text-slate-600 mt-2">
                                Esta ação não pode ser desfeita. O documento "{document.title}" será permanentemente excluído.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 border border-brand-slate/10 text-brand-slate px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-cream transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Share Modal */}
            <ShareDocumentModal
                documentId={docId}
                clientId={clientId}
                documentTitle={document.title}
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
            />
        </div>
    );
}
