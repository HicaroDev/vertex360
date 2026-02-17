"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    Calendar,
    X,
    Trash2,
    Edit,
    Loader2
} from "lucide-react";
import Link from "next/link";
import type { Client } from "@/lib/supabase";

export default function AdminClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewClientModal, setShowNewClientModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [deletingClient, setDeleteingClient] = useState<Client | null>(null);

    // Carregar clientes do banco
    useEffect(() => {
        loadClients();
    }, []);

    async function loadClients() {
        try {
            setLoading(true);
            const { getClients } = await import('@/lib/database');
            const data = await getClients();
            setClients(data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        } finally {
            setLoading(false);
        }
    }

    // Filtrar clientes pela busca
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.segment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Criar novo cliente
    async function handleCreateClient(formData: FormData) {
        try {
            const { supabase } = await import('@/lib/supabase');

            const { data, error } = await supabase
                .from('clients')
                .insert([{
                    name: formData.get('name') as string,
                    company: formData.get('company') as string,
                    segment: formData.get('segment') as string,
                    status: formData.get('status') as string || 'Ativo',
                    progress: parseInt(formData.get('progress') as string) || 0,
                    health: formData.get('health') as string || 'Ideal',
                    since: formData.get('since') as string,
                    next_meeting: formData.get('next_meeting') as string,
                    access_login: formData.get('access_login') as string,
                    access_password: formData.get('access_password') as string,
                }])
                .select();

            if (error) throw error;

            await loadClients();
            setShowNewClientModal(false);
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            alert('Erro ao criar cliente. Verifique o console.');
        }
    }

    // Atualizar cliente
    async function handleUpdateClient(formData: FormData) {
        if (!editingClient) return;

        try {
            const { supabase } = await import('@/lib/supabase');

            const { error } = await supabase
                .from('clients')
                .update({
                    name: formData.get('name') as string,
                    company: formData.get('company') as string,
                    segment: formData.get('segment') as string,
                    status: formData.get('status') as string,
                    progress: parseInt(formData.get('progress') as string),
                    health: formData.get('health') as string,
                    since: formData.get('since') as string,
                    next_meeting: formData.get('next_meeting') as string,
                    access_login: formData.get('access_login') as string,
                    access_password: formData.get('access_password') as string,
                })
                .eq('id', editingClient.id);

            if (error) throw error;

            await loadClients();
            setEditingClient(null);
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            alert('Erro ao atualizar cliente. Verifique o console.');
        }
    }

    // Deletar cliente
    async function handleDeleteClient() {
        if (!deletingClient) return;

        try {
            const { supabase } = await import('@/lib/supabase');

            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', deletingClient.id);

            if (error) throw error;

            await loadClients();
            setDeleteingClient(null);
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            alert('Erro ao deletar cliente. Verifique o console.');
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-brand-slate uppercase tracking-tighter">Gestão de Carteira</h2>
                    <p className="text-slate-400 font-medium">Gerencie seus clientes e acompanhe a aplicação do Método Vertex 360.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-brand-slate/10 px-6 py-4 text-xs font-bold text-brand-slate uppercase tracking-widest hover:border-brand-gold transition-colors">
                        <Filter className="w-4 h-4" /> Filtrar
                    </button>
                    <button
                        onClick={() => setShowNewClientModal(true)}
                        className="flex items-center gap-2 bg-brand-gold text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-slate transition-all shadow-lg hover:shadow-brand-gold/10"
                    >
                        <Plus className="w-4 h-4" /> Novo Cliente
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-gold transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar por nome, empresa ou segmento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-brand-slate/10 pl-16 pr-6 py-6 text-sm focus:outline-none focus:border-brand-gold transition-all shadow-sm"
                />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredClients.length === 0 && (
                <div className="bg-white border border-brand-slate/10 p-20 text-center">
                    <p className="text-slate-400 font-medium">
                        {searchTerm ? 'Nenhum cliente encontrado com esse termo.' : 'Nenhum cliente cadastrado ainda.'}
                    </p>
                </div>
            )}

            {/* Clients Grid */}
            {!loading && filteredClients.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {filteredClients.map((client, idx) => (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white border border-brand-slate/10 hover:border-brand-gold transition-all group overflow-hidden"
                        >
                            <div className="p-8 flex flex-col lg:flex-row lg:items-center gap-8">
                                {/* Client Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 ${client.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {client.status}
                                        </span>
                                        {client.segment && (
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-brand-cream text-brand-gold px-2 py-1">
                                                {client.segment}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-brand-slate uppercase tracking-tight group-hover:text-brand-gold transition-colors">
                                            {client.name}
                                        </h3>
                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">{client.company}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {client.since ? `Cliente desde ${client.since}` : 'Novo cliente'}
                                        </div>
                                        {client.next_meeting && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                                                • Próxima reunião: {client.next_meeting}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="lg:w-64 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-brand-slate uppercase tracking-widest">Progresso Vertex</span>
                                        <span className="text-lg font-black text-brand-slate">{client.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-brand-cream overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${client.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-brand-gold"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                        <span className="text-slate-400">Status:</span>
                                        <span className={`${client.health === 'Ideal' ? 'text-emerald-600' : 'text-amber-600'
                                            }`}>{client.health}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => setEditingClient(client)}
                                        className="p-3 text-slate-400 hover:text-brand-gold transition-colors border border-transparent hover:border-brand-gold/20"
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteingClient(client)}
                                        className="p-3 text-slate-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-200"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <Link
                                        href={`/admin/clients/${client.id}`}
                                        className="flex items-center gap-2 bg-brand-slate text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold transition-all"
                                    >
                                        Gerenciar <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            {/* Health Indicator bar at the bottom */}
                            <div className={`h-1 w-full ${client.health === 'Ideal' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {!loading && filteredClients.length > 0 && (
                <div className="flex items-center justify-between pt-10 border-t border-brand-slate/10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Mostrando {filteredClients.length} de {clients.length} clientes
                    </p>
                </div>
            )}

            {/* Modal: Novo Cliente */}
            <ClientFormModal
                isOpen={showNewClientModal}
                onClose={() => setShowNewClientModal(false)}
                onSubmit={handleCreateClient}
                title="Novo Cliente"
            />

            {/* Modal: Editar Cliente */}
            <ClientFormModal
                isOpen={!!editingClient}
                onClose={() => setEditingClient(null)}
                onSubmit={handleUpdateClient}
                title="Editar Cliente"
                initialData={editingClient || undefined}
            />

            {/* Modal: Confirmar Exclusão */}
            <DeleteConfirmModal
                isOpen={!!deletingClient}
                onClose={() => setDeleteingClient(null)}
                onConfirm={handleDeleteClient}
                clientName={deletingClient?.name || ''}
            />
        </div>
    );
}

// Componente de Modal de Formulário
function ClientFormModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    initialData
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    title: string;
    initialData?: Client;
}) {
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.currentTarget);
        await onSubmit(formData);
        setSubmitting(false);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-8 border-b border-brand-slate/10">
                                <h3 className="text-2xl font-black text-brand-slate uppercase tracking-tight">{title}</h3>
                                <button onClick={onClose} className="p-2 hover:bg-brand-cream transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Nome do Cliente *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={initialData?.name}
                                            required
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                                            placeholder="Ex: Ferreira Distribuidora"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Razão Social *
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            defaultValue={initialData?.company}
                                            required
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                                            placeholder="Ex: Ferreira Logística e Distribuidora LTDA"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Segmento
                                        </label>
                                        <input
                                            type="text"
                                            name="segment"
                                            defaultValue={initialData?.segment || ''}
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                                            placeholder="Ex: Logística"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            defaultValue={initialData?.status || 'Ativo'}
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                                        >
                                            <option value="Ativo">Ativo</option>
                                            <option value="Onboarding">Onboarding</option>
                                            <option value="Pausado">Pausado</option>
                                            <option value="Inativo">Inativo</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Progresso (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="progress"
                                            min="0"
                                            max="100"
                                            defaultValue={initialData?.progress || 0}
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Saúde
                                        </label>
                                        <select
                                            name="health"
                                            defaultValue={initialData?.health || 'Ideal'}
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                                        >
                                            <option value="Ideal">Ideal</option>
                                            <option value="Atenção">Atenção</option>
                                            <option value="Crítico">Crítico</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Cliente desde
                                        </label>
                                        <input
                                            type="text"
                                            name="since"
                                            defaultValue={initialData?.since || ''}
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                                            placeholder="Ex: Nov/2025"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Próxima Reunião
                                        </label>
                                        <input
                                            type="text"
                                            name="next_meeting"
                                            defaultValue={initialData?.next_meeting || ''}
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                                            placeholder="Ex: 22/02 - 14:00"
                                        />
                                    </div>

                                    <div className="col-span-2 pt-4 border-t border-brand-slate/5">
                                        <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-4">Credenciais de Acesso</h4>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Username / Login
                                        </label>
                                        <input
                                            type="text"
                                            name="access_login"
                                            defaultValue={initialData?.access_login || ''}
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold bg-slate-50"
                                            placeholder="Ex: ferreira_acesso"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-brand-slate uppercase tracking-widest mb-2">
                                            Senha de Acesso
                                        </label>
                                        <input
                                            type="text"
                                            name="access_password"
                                            defaultValue={initialData?.access_password || ''}
                                            className="w-full border border-brand-slate/10 px-4 py-3 text-sm focus:outline-none focus:border-brand-gold bg-slate-50"
                                            placeholder="Ex: rv2025!"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-slate/10">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-3 border border-brand-slate/10 text-xs font-bold uppercase tracking-widest text-brand-slate hover:bg-brand-cream transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-8 py-3 bg-brand-gold text-white text-xs font-black uppercase tracking-widest hover:bg-brand-slate transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {submitting ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Componente de Modal de Confirmação de Exclusão
function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    clientName
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    clientName: string;
}) {
    const [deleting, setDeleting] = useState(false);

    async function handleConfirm() {
        setDeleting(true);
        await onConfirm();
        setDeleting(false);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white w-full max-w-md">
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-brand-slate uppercase tracking-tight">
                                            Confirmar Exclusão
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-1">Esta ação não pode ser desfeita</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600">
                                    Tem certeza que deseja excluir o cliente <strong>{clientName}</strong>?
                                    Todos os dados relacionados (workspaces e documentos) também serão removidos.
                                </p>

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-brand-slate/10">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 border border-brand-slate/10 text-xs font-bold uppercase tracking-widest text-brand-slate hover:bg-brand-cream transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={deleting}
                                        className="px-8 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {deleting ? 'Excluindo...' : 'Excluir'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
