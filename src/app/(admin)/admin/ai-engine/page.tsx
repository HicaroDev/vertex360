"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
    Send,
    Copy,
    RotateCcw,
    FileText,
    Save,
    ChevronDown
} from "lucide-react";

const prompts = [
    { id: "analise-documental", label: "Relatório de Análise Documental (Fase 1)" },
    { id: "historico-organizacional", label: "Histórico Organizacional" },
    { id: "financeiro-maturidade", label: "Financeiro e Maturidade" },
    { id: "ata-reuniao", label: "Ata de Reunião Padronizada" },
];

export default function AIEnginePage() {
    const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
    const [inputData, setInputData] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState("");
    const [selectedClient, setSelectedClient] = useState("Ferreira Distribuidora");

    const handleGenerate = () => {
        if (!inputData) return;
        setIsGenerating(true);

        setTimeout(() => {
            setResult(`RELATÓRIO DE ANÁLISE DOCUMENTAL - GERADO VIA MOTOR VERTEX\n\n` +
                `Empresa: ${selectedClient.toUpperCase()}\n` +
                `Data: ${new Date().toLocaleDateString()}\n` +
                `Responsável: Stela / Motor Vertex 360\n\n` +
                `1. OBJETIVO DO RELATÓRIO\n` +
                `Apresentar achados da análise documental Fase 1...\n\n` +
                `[CONTEÚDO PROCESSADO]:\n` +
                inputData.slice(0, 500) + "...\n\n" +
                `Encaminhamentos Estratégicos:\n` +
                `- Regularizar alvará de funcionamento e licenças ambientais.\n` +
                `- Estruturar fluxo de caixa mensal com foco em margem bruta.\n` +
                `- Revisar política de compras e prazos médios de pagamento.`);
            setIsGenerating(false);
        }, 2000);
    };

    const handlePublish = () => {
        alert(`Documento publicado com sucesso para o portal do cliente: ${selectedClient}!`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-brand-slate uppercase tracking-tight">Motor Vertex (IA)</h2>
                    <p className="text-slate-400 text-sm font-medium">Transforme dados brutos em relatórios técnicos de alto padrão.</p>
                </div>
                <div className="flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-2 border border-brand-gold/20">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">IA Ativa</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Input Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-slate uppercase tracking-widest flex items-center gap-2">
                                1. Selecionar Prompt da Metodologia
                            </label>
                            <div className="relative group">
                                <select
                                    className="w-full bg-white border border-brand-slate/10 p-4 text-xs font-bold text-brand-slate uppercase focus:outline-none focus:border-brand-gold appearance-none"
                                    onChange={(e) => setSelectedPrompt(prompts.find(p => p.id === e.target.value) || prompts[0])}
                                >
                                    {prompts.map(p => (
                                        <option key={p.id} value={p.id}>{p.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-slate" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-slate uppercase tracking-widest">
                                2. Cliente Relacionado
                            </label>
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="w-full bg-white border border-brand-slate/10 p-4 text-xs font-bold text-brand-slate uppercase focus:outline-none focus:border-brand-gold appearance-none"
                            >
                                <option>Ferreira Distribuidora</option>
                                <option>Brutha Construtora</option>
                                <option>Pitanga Doce</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-slate uppercase tracking-widest">
                            3. Informe os Dados Brutos (Notas, Achados, Checklists)
                        </label>
                        <textarea
                            className="w-full h-80 bg-white border border-brand-slate/10 p-6 text-sm focus:outline-none focus:border-brand-gold resize-none"
                            placeholder="Cole aqui as informações coletadas na reunião ou análise documental..."
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !inputData}
                        className="w-full bg-brand-slate text-white py-5 px-8 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-gold transition-all duration-300 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <RotateCcw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {isGenerating ? "Processando Inteligência..." : "Gerar Padronização Vertex"}
                    </button>

                    {/* Output Preview */}
                    <div className="bg-brand-slate p-8 flex flex-col min-h-[500px] border-t-8 border-brand-gold relative overflow-hidden">
                        <div className="flex items-center justify-between relative z-10 mb-8">
                            <h3 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">Visualização Técnica</h3>
                            <div className="flex gap-4">
                                <button className="text-white hover:text-brand-gold transition-colors"><Copy className="w-4 h-4" /></button>
                                <button
                                    onClick={handlePublish}
                                    className="flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest hover:underline"
                                >
                                    <Save className="w-4 h-4" /> Publicar no Portal
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 flex-1 p-8 overflow-y-auto text-slate-300 font-mono text-sm leading-relaxed relative z-10 whitespace-pre-wrap min-h-[400px]">
                            {result || (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 pt-20">
                                    <FileText className="w-12 h-12 opacity-20" />
                                    <p className="text-[10px] uppercase font-bold tracking-widest">O resultado gerado aparecerá aqui</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Digital Library / Migrated Content */}
                <div className="space-y-6">
                    <div className="bg-white border border-brand-slate/10 p-6">
                        <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest mb-6 pb-4 border-b border-brand-slate/5">
                            Biblioteca de Referência (Migrada)
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: "Ata Reunião Kickoff", date: "12/09/25", tags: ["Brutha"] },
                                { title: "Histórico Organizacional", date: "05/10/25", tags: ["Ferreira"] },
                                { title: "Maturidade Financeira", date: "22/11/25", tags: ["Trauen"] },
                            ].map((ref, idx) => (
                                <div key={idx} className="group cursor-pointer hover:bg-brand-cream/50 p-4 transition-colors border-l-2 border-transparent hover:border-brand-gold">
                                    <p className="text-[10px] font-bold text-brand-slate uppercase leading-tight">{ref.title}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[9px] text-slate-400 font-bold">{ref.date}</span>
                                        <span className="text-[9px] bg-brand-slate/5 px-2 py-0.5 text-brand-gold font-bold uppercase">{ref.tags[0]}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-[9px] font-black uppercase tracking-widest text-brand-gold hover:underline">
                            Ver todos os 134 documentos
                        </button>
                    </div>

                    <div className="bg-brand-gold p-8 text-white space-y-4 shadow-2xl">
                        <Sparkles className="w-6 h-6" />
                        <h4 className="font-bold text-sm uppercase leading-tight text-white">Dica de Especialista</h4>
                        <p className="text-[11px] leading-relaxed text-white/90">
                            Para melhores resultados, use o prompt "Análise Documental" ao processar balancetes e demonstrações contábeis coletadas na Fase 1.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
