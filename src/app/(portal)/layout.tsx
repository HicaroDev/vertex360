import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-brand-cream overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="w-80 flex-shrink-0 hidden lg:block border-r border-brand-slate/10 shadow-2xl z-20">
                <DashboardSidebar />
            </aside>

            {/* Main Content Areas */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Header/Top Bar */}
                <header className="h-20 bg-white/50 backdrop-blur-md border-b border-brand-slate/10 flex items-center justify-between px-8 z-10">
                    <div>
                        <h1 className="text-brand-slate font-bold tracking-tight uppercase text-lg">
                            Painel de Estratégia
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-bold text-brand-slate leading-none">Ferreira Distribuidora</p>
                            <p className="text-[10px] font-semibold text-brand-gold uppercase tracking-wider">Cliente VIP</p>
                        </div>
                        <div className="w-10 h-10 bg-brand-slate text-white flex items-center justify-center font-bold text-sm">
                            FD
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
