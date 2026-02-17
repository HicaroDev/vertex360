import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-brand-cream overflow-hidden">
            <aside className="w-80 flex-shrink-0 hidden lg:block border-r border-brand-slate/10 shadow-2xl z-20">
                <AdminSidebar />
            </aside>

            <main className="flex-1 flex flex-col min-w-0 relative">
                <header className="h-20 bg-white border-b border-brand-slate/10 flex items-center justify-between px-8 z-10">
                    <div>
                        <h1 className="text-brand-slate font-black tracking-tight uppercase text-lg">
                            Sistema de Gestão R&V
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-bold text-brand-slate leading-none">Stela Rodrigues</p>
                            <p className="text-[10px] font-semibold text-brand-gold uppercase tracking-wider">Administradora</p>
                        </div>
                        <div className="w-10 h-10 border-2 border-brand-slate flex items-center justify-center font-bold text-sm">
                            SR
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
