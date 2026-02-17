"use client";

import { useEffect, useState } from "react";

type TableCheck = {
    name: string;
    exists: boolean;
    count: number;
    error?: string;
};

export default function DiagnosticPage() {
    const [tables, setTables] = useState<TableCheck[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkTables() {
            try {
                const { supabase } = await import('@/lib/supabase');

                const tablesToCheck = ['clients', 'workspaces', 'documents'];
                const results: TableCheck[] = [];

                for (const tableName of tablesToCheck) {
                    try {
                        const { data, error, count } = await supabase
                            .from(tableName)
                            .select('*', { count: 'exact', head: true });

                        results.push({
                            name: tableName,
                            exists: !error,
                            count: count || 0,
                            error: error?.message
                        });
                    } catch (err: any) {
                        results.push({
                            name: tableName,
                            exists: false,
                            count: 0,
                            error: err.message
                        });
                    }
                }

                setTables(results);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao verificar tabelas:', err);
                setLoading(false);
            }
        }

        checkTables();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        🔍 Diagnóstico do Banco de Dados
                    </h1>
                    <p className="text-slate-500">Verificando estrutura das tabelas no Supabase</p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-blue-50 border-2 border-blue-300 p-8 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-lg font-bold text-blue-900">Verificando tabelas...</p>
                        </div>
                    </div>
                )}

                {/* Results */}
                {!loading && (
                    <div className="space-y-4">
                        {tables.map((table) => (
                            <div
                                key={table.name}
                                className={`p-6 rounded-lg border-2 ${table.exists
                                        ? 'bg-emerald-50 border-emerald-300'
                                        : 'bg-red-50 border-red-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className={`text-lg font-bold ${table.exists ? 'text-emerald-900' : 'text-red-900'
                                            }`}>
                                            {table.exists ? '✅' : '❌'} Tabela: {table.name}
                                        </h3>
                                        {table.exists ? (
                                            <p className="text-emerald-700 mt-1">
                                                {table.count} registro(s) encontrado(s)
                                            </p>
                                        ) : (
                                            <p className="text-red-700 mt-1">
                                                Erro: {table.error || 'Tabela não encontrada'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary */}
                {!loading && (
                    <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                            📊 Resumo
                        </h3>
                        <div className="space-y-2">
                            <p className="text-slate-700">
                                <span className="font-bold">Total de tabelas:</span> {tables.length}
                            </p>
                            <p className="text-slate-700">
                                <span className="font-bold">Tabelas OK:</span>{' '}
                                {tables.filter(t => t.exists).length}
                            </p>
                            <p className="text-slate-700">
                                <span className="font-bold">Tabelas com erro:</span>{' '}
                                {tables.filter(t => !t.exists).length}
                            </p>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                {!loading && tables.some(t => !t.exists) && (
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                        <h4 className="font-bold text-amber-900 mb-3">⚠️ Ação Necessária:</h4>
                        <p className="text-sm text-amber-800 mb-3">
                            Algumas tabelas não foram encontradas. Você precisa executar o SQL no Supabase:
                        </p>
                        <ol className="space-y-2 text-sm text-amber-800 list-decimal list-inside">
                            <li>Abra o Supabase Dashboard</li>
                            <li>Vá em <code className="bg-amber-100 px-1 rounded">SQL Editor</code></li>
                            <li>Clique em <code className="bg-amber-100 px-1 rounded">+ New query</code></li>
                            <li>Cole o conteúdo do arquivo <code className="bg-amber-100 px-1 rounded">c:\n\supabase-setup.sql</code></li>
                            <li>Clique em <code className="bg-amber-100 px-1 rounded">Run</code></li>
                            <li>Recarregue esta página</li>
                        </ol>
                    </div>
                )}

                {/* Success */}
                {!loading && tables.every(t => t.exists) && (
                    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg">
                        <h4 className="font-bold text-emerald-900 mb-3">🎉 Tudo Pronto!</h4>
                        <p className="text-sm text-emerald-800">
                            Todas as tabelas foram criadas com sucesso! Você pode começar a usar o sistema.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
