"use client";

import DocumentEditorPro from "@/components/DocumentEditorPro";
import { useState } from "react";

export default function EditorTestPage() {
    const [content, setContent] = useState(null);

    async function handleSave(newContent: any): Promise<void> {
        console.log("Conteúdo salvo:", newContent);
        setContent(newContent);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("✅ Documento salvo com sucesso!");
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Card de informação */}
            <div className="bg-white border border-brand-slate/10 p-6">
                <h1 className="text-2xl font-black text-brand-slate uppercase tracking-tight mb-2">
                    🧪 Teste do Editor PRO
                </h1>
                <p className="text-sm text-slate-600 mb-4">
                    Esta é uma página de teste para verificar todas as funcionalidades do editor.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-brand-cream/20 p-4 border border-brand-gold/20">
                        <h3 className="text-xs font-bold text-brand-gold uppercase mb-2">✅ Toolbar Sticky</h3>
                        <p className="text-xs text-slate-600">Role a página para baixo para colar no header</p>
                    </div>
                    <div className="bg-brand-cream/20 p-4 border border-brand-gold/20">
                        <h3 className="text-xs font-bold text-brand-gold uppercase mb-2">✅ Imagens Redimensionáveis</h3>
                        <p className="text-xs text-slate-600">Arraste handles nos cantos</p>
                    </div>
                    <div className="bg-brand-cream/20 p-4 border border-brand-gold/20">
                        <h3 className="text-xs font-bold text-brand-gold uppercase mb-2">✅ Auto-save</h3>
                        <p className="text-xs text-slate-600">Desativado (manual)</p>
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div className="bg-white">
                <DocumentEditorPro
                    clientId="test"
                    workspaceId="test"
                    onSave={handleSave}
                    autoSave={false}
                />
            </div>

            {/* JSON Output */}
            {content && (
                <div className="bg-white border border-brand-slate/10 p-6 mt-8">
                    <h2 className="text-sm font-black text-brand-slate uppercase tracking-widest mb-4">
                        Conteúdo Salvo (JSON):
                    </h2>
                    <pre className="bg-slate-50 p-4 text-xs overflow-auto">
                        {JSON.stringify(content, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
