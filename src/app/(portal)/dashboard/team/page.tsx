"use client";

import { motion } from "framer-motion";
import {
    Users,
    Mail,
    Phone,
    ShieldCheck,
    Briefcase,
    Star,
    Award,
    Linkedin,
    Calendar,
    MessageSquare,
    Zap,
    Plus,
    CheckCircle2
} from "lucide-react";

const teamMembers = [
    {
        name: "Stela Rodrigues",
        role: "Head de Estratégia",
        description: "Especialista em reestruturação empresarial e governança corporativa. Responsável pelo direcionamento estratégico e expansão do Método Vertex.",
        specialties: ["Estratégia", "Governança", "Liderança"],
        image: null,
        isLead: true
    },
    {
        name: "Raiane Vieira",
        role: "Estrategista de Controladoria",
        description: "Foco em inteligência financeira, processos administrativos e otimização de rentabilidade. Guardiã dos números e da eficiência operacional.",
        specialties: ["Financeiro", "Processos", "KPIs"],
        image: null,
        isLead: true
    },
    {
        name: "Mariana Costa",
        role: "Account Manager",
        description: "Responsável pelo acompanhamento diário, suporte aos pilares de RH e comunicação entre o cliente e o time de especialistas.",
        specialties: ["Suporte", "RH", "Comercial"],
        image: null,
        isLead: false
    }
];

export default function TeamPage() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs">Apoio Especializado</h2>
                    <h1 className="text-5xl font-black text-brand-slate uppercase tracking-tighter">Sua Equipe R&V</h1>
                    <p className="text-slate-400 text-sm max-w-xl">
                        Conheça os especialistas dedicados à transformação e escalabilidade do seu negócio através do Método Vertex 360.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button className="bg-brand-slate text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-gold transition-all shadow-xl flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-brand-gold" /> Agendar Mentoria
                    </button>
                </div>
            </div>

            {/* Team Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
                {teamMembers.map((member, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        className="bg-white border border-brand-slate/10 hover:border-brand-gold transition-all group overflow-hidden flex flex-col"
                    >
                        {/* Member Header / Image Placeholder */}
                        <div className="h-64 bg-brand-slate relative flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-brand-gold/10 mix-blend-overlay" />
                            <Users className="w-20 h-20 text-white/10" />
                            {member.isLead && (
                                <div className="absolute top-6 right-6 bg-brand-gold text-white p-2 flex items-center gap-2 shadow-xl">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Sócio Diretor</span>
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-brand-slate to-transparent">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">{member.name}</h3>
                                <p className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{member.role}</p>
                            </div>
                        </div>

                        {/* Member Info */}
                        <div className="p-8 space-y-6 flex-1 flex flex-col">
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {member.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {member.specialties.map((s, j) => (
                                    <span key={j} className="text-[9px] font-black text-brand-slate bg-brand-cream px-2 py-1 uppercase tracking-widest border border-brand-slate/5">
                                        {s}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-brand-slate/5 mt-auto flex items-center justify-between">
                                <div className="flex gap-4">
                                    <button className="text-slate-400 hover:text-brand-slate transition-colors pointer-events-none opacity-50"><Mail className="w-4 h-4" /></button>
                                    <button className="text-slate-400 hover:text-brand-slate transition-colors pointer-events-none opacity-50"><Linkedin className="w-4 h-4" /></button>
                                </div>
                                <button className="flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-widest hover:underline uppercase transition-all">
                                    <MessageSquare className="w-4 h-4" /> Contatar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Collaborative Culture Card */}
                <motion.div variants={item} className="bg-brand-slate p-10 text-white border-t-8 border-brand-gold flex flex-col justify-between">
                    <div className="space-y-6">
                        <Award className="w-10 h-10 text-brand-gold" />
                        <h3 className="text-3xl font-black uppercase tracking-tight leading-tight">Sua Escolha por Excelência</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Ao contratar a R&V, você não tem apenas um consultor, mas um time multidisciplinar que atua como braço estratégico da sua gestão.
                        </p>
                    </div>
                    <ul className="space-y-4 mt-10">
                        {["Mentoria Mensal", "Suporte VIP", "Auditoria de Pilares", "Relatórios Periódicos"].map((item, id) => (
                            <li key={id} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-brand-gold">
                                <CheckCircle2 className="w-4 h-4" /> {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </motion.div>

            {/* Support Information */}
            <motion.div variants={item} className="bg-white border border-brand-slate/10 p-12 text-center space-y-6 max-w-3xl mx-auto">
                <Zap className="w-10 h-10 text-brand-gold mx-auto" />
                <h3 className="text-2xl font-black text-brand-slate uppercase tracking-tight">Precisa de Suporte Técnico?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Para questões relacionadas ao portal, acesso a documentos ou problemas técnicos na visualização das métricas, utilize nosso canal direto de suporte.
                </p>
                <div className="flex items-center justify-center gap-8 pt-4">
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-slate">suporte@rvgestao.com.br</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-slate">+55 (62) 99999-9999</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
