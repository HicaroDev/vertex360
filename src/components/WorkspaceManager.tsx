"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Save, FolderPlus, GripVertical, AlertCircle } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createWorkspace, updateWorkspace, deleteWorkspace } from "@/lib/database";

interface Workspace {
    id: string;
    folder_name: string;
    color: string;
    order_index?: number;
}

interface WorkspaceManagerProps {
    clientId: string;
    workspaces: Workspace[];
    onWorkspacesChange: () => void;
}

function SortableWorkspaceItem({ workspace, editingId, editName, setEditName, setEditingId, handleUpdate, handleDelete }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: workspace.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 border border-brand-slate/10 hover:bg-brand-cream/10 transition-colors bg-white"
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-slate-400" />
            </div>

            {editingId === workspace.id ? (
                <>
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 border border-brand-slate/10 px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(workspace.id)}
                    />
                    <button
                        onClick={() => handleUpdate(workspace.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Salvar"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setEditName("");
                        }}
                        className="p-2 text-slate-400 hover:bg-slate-50 transition-colors"
                        title="Cancelar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </>
            ) : (
                <>
                    <div className={`w-3 h-3 rounded-full ${workspace.color}`} />
                    <span className="flex-1 text-sm font-medium text-brand-slate">
                        {workspace.folder_name}
                    </span>
                    <button
                        onClick={() => {
                            setEditingId(workspace.id);
                            setEditName(workspace.folder_name);
                        }}
                        className="p-2 text-slate-400 hover:text-brand-gold hover:bg-brand-cream transition-colors"
                        title="Editar"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(workspace.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Excluir"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </>
            )}
        </div>
    );
}

export default function WorkspaceManager({
    clientId,
    workspaces,
    onWorkspacesChange
}: WorkspaceManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newWorkspace, setNewWorkspace] = useState({ name: "", color: "text-blue-500" });
    const [editName, setEditName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Estado local para permitir reordenação antes de salvar
    const [localWorkspaces, setLocalWorkspaces] = useState<Workspace[]>([]);

    // Sincronizar localWorkspaces quando o modal abre ou workspaces mudam externamente
    useEffect(() => {
        if (isOpen) {
            const sorted = [...workspaces].sort((a, b) =>
                (a.order_index || 0) - (b.order_index || 0)
            );
            setLocalWorkspaces(sorted);
        }
    }, [isOpen, workspaces]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const colors = [
        { value: "text-blue-500", label: "Azul" },
        { value: "text-emerald-500", label: "Verde" },
        { value: "text-brand-gold", label: "Dourado" },
        { value: "text-rose-500", label: "Rosa" },
        { value: "text-amber-500", label: "Âmbar" },
    ];

    async function handleCreate() {
        if (!newWorkspace.name.trim()) {
            setError("Digite um nome para o workspace");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Usar localWorkspaces para pegar o próximo order_index
            const maxOrder = Math.max(...localWorkspaces.map(w => w.order_index || 0), -1);

            const workspaceData: any = {
                client_id: clientId,
                folder_name: newWorkspace.name,
                color: newWorkspace.color,
                icon: 'FolderOpen'
            };

            try {
                await createWorkspace({ ...workspaceData, order_index: maxOrder + 1 });
            } catch (err: any) {
                if (err.message?.includes('order_index') || err.message?.includes('column')) {
                    await createWorkspace(workspaceData);
                    setError("Workspace criado, mas a coluna 'order_index' não existe no banco.");
                } else {
                    throw err;
                }
            }

            setNewWorkspace({ name: "", color: "text-blue-500" });
            onWorkspacesChange();
        } catch (error: any) {
            console.error('Erro ao criar workspace:', error);
            setError(`Erro: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(id: string) {
        if (!editName.trim()) {
            setError("Digite um nome para o workspace");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await updateWorkspace(id, { folder_name: editName });
            setEditingId(null);
            setEditName("");
            onWorkspacesChange();
        } catch (error: any) {
            console.error('Erro ao atualizar workspace:', error);
            setError(`Erro ao atualizar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir este workspace? Todos os documentos dentro dele serão excluídos também.')) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await deleteWorkspace(id);
            onWorkspacesChange();
        } catch (error: any) {
            console.error('Erro ao excluir workspace:', error);
            setError(`Erro ao excluir: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    // DragEnd agora é APENAS LOCAL
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = localWorkspaces.findIndex(w => w.id === active.id);
        const newIndex = localWorkspaces.findIndex(w => w.id === over.id);

        const newOrder = arrayMove(localWorkspaces, oldIndex, newIndex);
        setLocalWorkspaces(newOrder);
    }

    // Função para salvar tudo ao fechar
    async function handleSaveAndClose() {
        setLoading(true);
        try {
            setError(null);
            // Atualizar order_index sequencial de acordo com a ordem local
            for (let i = 0; i < localWorkspaces.length; i++) {
                try {
                    await updateWorkspace(localWorkspaces[i].id, { order_index: i });
                } catch (err: any) {
                    // Ignorar erros de coluna de ordem se não existirem
                    if (err.message?.includes('order_index')) break;
                }
            }
            onWorkspacesChange();
            setIsOpen(false);
        } catch (error: any) {
            console.error('Erro ao salvar ordem final:', error);
            setError(`Erro ao salvar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Botão de Abrir Modal */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-slate transition-colors"
            >
                <FolderPlus className="w-4 h-4" />
                Gerenciar Workspaces
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-brand-slate/10 p-6 flex items-center justify-between z-10">
                            <h2 className="text-xl font-black text-brand-slate uppercase tracking-tight">
                                Gerenciar Workspaces
                            </h2>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setError(null);
                                }}
                                className="p-2 hover:bg-brand-cream transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Erro:</strong> {error}
                                    <button
                                        onClick={() => setError(null)}
                                        className="ml-2 underline hover:no-underline"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Criar Novo */}
                        <div className="p-6 border-b border-brand-slate/10 bg-brand-cream/20">
                            <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest mb-4">
                                Criar Novo Workspace
                            </h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newWorkspace.name}
                                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                                    placeholder="Nome do workspace"
                                    className="flex-1 border border-brand-slate/10 px-4 py-2 text-sm focus:outline-none focus:border-brand-gold"
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                                    disabled={loading}
                                />
                                <select
                                    value={newWorkspace.color}
                                    onChange={(e) => setNewWorkspace({ ...newWorkspace, color: e.target.value })}
                                    className="border border-brand-slate/10 px-4 py-2 text-sm focus:outline-none focus:border-brand-gold"
                                    disabled={loading}
                                >
                                    {colors.map(color => (
                                        <option key={color.value} value={color.value}>
                                            {color.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="bg-brand-gold text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-slate transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    {loading ? 'Criando...' : 'Criar'}
                                </button>
                            </div>
                        </div>

                        {/* Lista de Workspaces */}
                        <div className="p-6 space-y-2">
                            <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest mb-4">
                                Workspaces Existentes ({localWorkspaces.length})
                                <span className="text-slate-400 font-normal ml-2">
                                    Arraste para reordenar
                                </span>
                            </h3>
                            {localWorkspaces.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">
                                    Nenhum workspace criado ainda.
                                </p>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={localWorkspaces.map(w => w.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {localWorkspaces.map((workspace) => (
                                            <SortableWorkspaceItem
                                                key={workspace.id}
                                                workspace={workspace}
                                                editingId={editingId}
                                                editName={editName}
                                                setEditName={setEditName}
                                                setEditingId={setEditingId}
                                                handleUpdate={handleUpdate}
                                                handleDelete={handleDelete}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-brand-slate/10 p-6">
                            <button
                                onClick={handleSaveAndClose}
                                disabled={loading}
                                className="w-full bg-brand-slate text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Salvando...' : 'Salvar e Fechar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
