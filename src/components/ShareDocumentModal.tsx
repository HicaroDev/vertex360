"use client";

import { useState } from "react";
import { Share2, Copy, Check, Clock, MessageSquare, Download, X, Loader2 } from "lucide-react";
import { shareDocument } from "@/lib/database";

interface ShareDocumentModalProps {
    documentId: string;
    clientId: string;
    documentTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareDocumentModal({
    documentId,
    clientId,
    documentTitle,
    isOpen,
    onClose
}: ShareDocumentModalProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [sharedData, setSharedData] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // Opções de permissão
    const [allowComments, setAllowComments] = useState(false);
    const [allowDownload, setAllowDownload] = useState(true);
    const [expiration, setExpiration] = useState<string | null>(null);

    async function handleGenerateLink() {
        try {
            setIsGenerating(true);
            const data = await shareDocument(documentId, clientId, {
                allow_comments: allowComments,
                allow_download: allowDownload,
                expires_at: expiration
            });
            setSharedData(data);
        } catch (error) {
            alert("Erro ao gerar link de compartilhamento.");
        } finally {
            setIsGenerating(false);
        }
    }

    function copyToClipboard() {
        if (!sharedData) return;
        const url = `${window.location.origin}/portal/doc/${sharedData.public_link}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-cream rounded-lg text-brand-gold">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-brand-slate uppercase tracking-tight">Compartilhar</h3>
                            <p className="text-xs text-slate-400 font-medium">"{documentTitle}"</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-brand-slate transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {!sharedData ? (
                        <>
                            {/* Permissões */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-brand-slate uppercase tracking-widest block mb-4">
                                    Configurações de Acesso
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setAllowComments(!allowComments)}
                                        className={`flex items-center gap-3 p-4 border transition-all text-left ${allowComments ? 'border-brand-gold bg-brand-cream/30' : 'border-slate-100'}`}
                                    >
                                        <div className={`p-2 rounded ${allowComments ? 'bg-brand-gold text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Comentários</p>
                                            <p className="text-[9px] text-slate-400 font-medium">Permitir feedback</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setAllowDownload(!allowDownload)}
                                        className={`flex items-center gap-3 p-4 border transition-all text-left ${allowDownload ? 'border-brand-gold bg-brand-cream/30' : 'border-slate-100'}`}
                                    >
                                        <div className={`p-2 rounded ${allowDownload ? 'bg-brand-gold text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Download className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Download PDF</p>
                                            <p className="text-[9px] text-slate-400 font-medium">Extrair documento</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Expiração */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-slate uppercase tracking-widest flex items-center gap-2 mb-2">
                                    <Clock className="w-3 h-3" /> Expiração do Link
                                </label>
                                <select
                                    className="w-full border border-slate-100 p-3 text-xs font-medium focus:outline-none focus:border-brand-gold bg-slate-50"
                                    onChange={(e) => {
                                        if (e.target.value === 'never') setExpiration(null);
                                        else {
                                            const d = new Date();
                                            d.setDate(d.getDate() + parseInt(e.target.value));
                                            setExpiration(d.toISOString());
                                        }
                                    }}
                                >
                                    <option value="never">Nunca expira</option>
                                    <option value="7">Expira em 7 dias</option>
                                    <option value="30">Expira em 30 dias</option>
                                </select>
                            </div>

                            <button
                                onClick={handleGenerateLink}
                                disabled={isGenerating}
                                className="w-full bg-brand-gold text-white py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-gold/20 hover:bg-brand-slate transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Gerando Link...
                                    </>
                                ) : (
                                    <>
                                        Gerar Link Público
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-500" />
                                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Link gerado com sucesso!</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-brand-slate uppercase tracking-widest">URL do Documento</p>
                                <div className="flex bg-slate-50 border border-slate-200">
                                    <input
                                        readOnly
                                        value={`${window.location.origin}/portal/doc/${sharedData.public_link}`}
                                        className="flex-1 bg-transparent px-4 py-3 text-xs font-medium text-brand-slate focus:outline-none"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="bg-brand-slate text-white px-4 hover:bg-brand-gold transition-colors flex items-center gap-2 text-[10px] font-bold uppercase"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copiado' : 'Copiar'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-brand-cream/30 p-4 border border-brand-cream text-[10px] text-brand-gold font-bold leading-relaxed">
                                DICA: Você pode enviar este link diretamente para o cliente via WhatsApp ou E-mail. Ele terá acesso somente à leitura deste documento.
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full border border-brand-slate/10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                            >
                                Fechar Modal
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
