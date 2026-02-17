"use client";

import { motion } from "framer-motion";
import {
    Settings,
    User,
    Lock,
    Bell,
    Shield,
    Smartphone,
    CreditCard,
    ChevronRight,
    Save,
    Camera,
    CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs">Customização & Segurança</h2>
                <h1 className="text-5xl font-black text-brand-slate uppercase tracking-tighter">Configurações</h1>
                <p className="text-slate-400 text-sm max-w-xl">
                    Gerencie seu perfil, preferências de notificação e configurações de segurança da sua conta no Portal R&V.
                </p>
            </div>

            {/* Profile Section */}
            <section className="bg-white border border-brand-slate/10 overflow-hidden">
                <div className="p-8 border-b border-brand-slate/5 bg-brand-cream/20">
                    <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest flex items-center gap-3">
                        <User className="w-4 h-4 text-brand-gold" /> Perfil da Empresa
                    </h3>
                </div>
                <div className="p-8 space-y-8">
                    <div className="flex items-center gap-10">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-brand-slate flex items-center justify-center text-white font-black text-4xl shadow-2xl relative overflow-hidden">
                                FD
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xl font-black text-brand-slate uppercase tracking-tight">Ferreira Distribuidora</h4>
                                <p className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">ID: RV-2025-042</p>
                            </div>
                            <button className="text-[10px] font-black text-brand-slate border border-brand-slate/10 px-4 py-2 uppercase tracking-widest hover:bg-brand-slate hover:text-white transition-all">
                                Alterar Logotipo
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Responsável Legal</label>
                            <input type="text" defaultValue="Carlos Alberto Ferreira" className="w-full bg-slate-50 border border-brand-slate/10 p-4 text-xs font-bold text-brand-slate focus:outline-none focus:border-brand-gold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">E-mail Corporativo</label>
                            <input type="email" defaultValue="carlos@ferreiradist.com.br" className="w-full bg-slate-50 border border-brand-slate/10 p-4 text-xs font-bold text-brand-slate focus:outline-none focus:border-brand-gold" />
                        </div>
                    </div>
                </div>
            </section>

            {/* General Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Security Section */}
                <section className="bg-white border border-brand-slate/10 flex flex-col">
                    <div className="p-8 border-b border-brand-slate/5 bg-brand-cream/20">
                        <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest flex items-center gap-3">
                            <Lock className="w-4 h-4 text-brand-gold" /> Segurança & Acesso
                        </h3>
                    </div>
                    <div className="p-8 space-y-6 flex-1">
                        {[
                            { icon: Shield, title: "Autenticação em 2 Etapas", desc: "Ative para maior proteção", status: "Inativo" },
                            { icon: Smartphone, title: "Dispositivos Conectados", desc: "Gerencie sessões ativas", status: "02" },
                        ].map((item, i) => (
                            <button key={i} className="w-full group flex items-center justify-between p-4 border border-transparent hover:border-brand-gold/20 hover:bg-brand-gold/5 transition-all text-left">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-brand-slate/5 text-brand-slate group-hover:text-brand-gold transition-colors">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-slate uppercase tracking-wide">{item.title}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
                                    <ChevronRight className="w-3 h-3 text-slate-300" />
                                </div>
                            </button>
                        ))}
                        <button className="w-full mt-4 py-4 border-2 border-brand-slate text-brand-slate text-xs font-black uppercase tracking-widest hover:bg-brand-slate hover:text-white transition-all">
                            Alterar Senha de Acesso
                        </button>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="bg-white border border-brand-slate/10 flex flex-col">
                    <div className="p-8 border-b border-brand-slate/5 bg-brand-cream/20">
                        <h3 className="text-xs font-black text-brand-slate uppercase tracking-widest flex items-center gap-3">
                            <Bell className="w-4 h-4 text-brand-gold" /> Preferências de Notificação
                        </h3>
                    </div>
                    <div className="p-8 space-y-6 flex-1">
                        {[
                            { title: "Relatórios IA Concluídos", enabled: true },
                            { title: "Novas Atas de Reunião", enabled: true },
                            { title: "Lembretes de Comprometimentos", enabled: true },
                            { title: "Mensagens da Consultoria", enabled: false },
                        ].map((pref, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <span className="text-xs font-bold text-brand-slate uppercase tracking-wide">{pref.title}</span>
                                <div className={`w-10 h-6 p-1 rounded-full cursor-pointer transition-colors ${pref.enabled ? 'bg-brand-gold' : 'bg-slate-200'}`}>
                                    <div className={`w-4 h-4 bg-white shadow-sm transition-transform ${pref.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Save Actions */}
            <div className="flex items-center justify-between p-8 bg-brand-slate text-white shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Suas alterações são salvas automaticamente após a confirmação.</p>
                </div>
                <button className="bg-brand-gold text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-brand-slate transition-all relative z-10">
                    Confirmar Alterações
                </button>
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl -mr-32 -mt-32" />
            </div>
        </div>
    );
}
