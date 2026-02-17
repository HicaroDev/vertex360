import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-brand-cream overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-brand-slate relative items-center justify-center p-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#967342_0%,transparent_50%)]" />
        </div>
        <div className="relative z-10 space-y-8">
          <Logo className="invert brightness-0 scale-150 origin-left" />
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">
            ESTRUTURAR.<br />
            IMPLEMENTAR.<br />
            <span className="text-brand-gold">MONITORAR.</span>
          </h2>
          <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
            Acompanhe a evolução do seu negócio em tempo real através da metodologia Vertex 360°.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:bg-transparent">
        <div className="w-full max-w-md space-y-12">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-brand-slate uppercase tracking-tight">Acesse o Portal</h1>
            <p className="text-slate-400 font-medium">Insira suas credenciais para gerenciar sua empresa.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-slate uppercase tracking-widest">E-mail Corporativo</label>
              <input
                type="email"
                placeholder="nome@empresa.com.br"
                className="w-full bg-white border border-brand-slate/10 px-6 py-4 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-brand-slate uppercase tracking-widest">Senha</label>
                <button type="button" className="text-[10px] font-bold text-brand-gold uppercase hover:underline">Esqueci a senha</button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white border border-brand-slate/10 px-6 py-4 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                required
              />
            </div>

            <Link
              href="/dashboard"
              className="group w-full bg-brand-slate text-white py-5 px-8 flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-gold transition-all duration-300"
            >
              Entrar no Sistema
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </form>

          <p className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
            Exclusivo para clientes R&V Consultores Associados
          </p>
        </div>
      </div>
    </div>
  );
}
