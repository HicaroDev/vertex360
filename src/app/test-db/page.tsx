"use client";

import { useEffect, useState } from "react";

export default function TestConnectionPage() {
    const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
    const [message, setMessage] = useState('Testando conexão...');
    const [envVars, setEnvVars] = useState({ url: '', key: '' });

    useEffect(() => {
        async function test() {
            try {
                console.log('🔍 Iniciando teste de conexão...');

                // Verificar variáveis de ambiente
                const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

                console.log('📋 URL:', url);
                console.log('🔑 Key:', key?.substring(0, 30) + '...');

                setEnvVars({
                    url: url || 'NÃO DEFINIDA',
                    key: key ? key.substring(0, 30) + '...' : 'NÃO DEFINIDA'
                });

                if (!url || !key) {
                    setStatus('error');
                    setMessage('❌ Variáveis de ambiente não encontradas! Verifique o arquivo .env');
                    return;
                }

                // Tentar importar o Supabase
                console.log('📦 Importando Supabase...');
                const { supabase } = await import('@/lib/supabase');

                console.log('✅ Supabase importado!');
                console.log('🔌 Testando conexão...');

                // Testar query simples
                const { data, error } = await supabase
                    .from('clients')
                    .select('*')
                    .limit(5);

                if (error) {
                    console.error('❌ Erro do Supabase:', error);
                    setStatus('error');
                    setMessage(`❌ Erro: ${error.message}`);
                    return;
                }

                console.log('✅ Dados recebidos:', data);

                setStatus('success');
                setMessage(`✅ Conexão estabelecida! ${data?.length || 0} cliente(s) encontrado(s).`);

            } catch (err: any) {
                console.error('❌ Erro geral:', err);
                setStatus('error');
                setMessage(`❌ Erro: ${err.message}`);
            }
        }

        test();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        🧪 Teste de Conexão Supabase
                    </h1>
                    <p className="text-slate-500">Verificando configuração do banco de dados</p>
                </div>

                {/* Status */}
                <div className={`p-8 rounded-lg border-2 ${status === 'testing' ? 'bg-blue-50 border-blue-300' :
                        status === 'success' ? 'bg-emerald-50 border-emerald-300' :
                            'bg-red-50 border-red-300'
                    }`}>
                    <div className="flex items-center gap-4">
                        {status === 'testing' && (
                            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        )}
                        <p className={`text-lg font-bold ${status === 'testing' ? 'text-blue-900' :
                                status === 'success' ? 'text-emerald-900' :
                                    'text-red-900'
                            }`}>
                            {message}
                        </p>
                    </div>
                </div>

                {/* Debug Info */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                        📊 Informações de Debug
                    </h3>
                    <div className="space-y-3 font-mono text-xs">
                        <div className="flex items-start gap-3">
                            <span className="text-slate-400 w-24">URL:</span>
                            <span className="text-slate-700 flex-1 break-all">{envVars.url}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-slate-400 w-24">Anon Key:</span>
                            <span className="text-slate-700 flex-1 break-all">{envVars.key}</span>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                    <h4 className="font-bold text-amber-900 mb-3">💡 Dicas de Solução:</h4>
                    <ul className="space-y-2 text-sm text-amber-800">
                        <li>• Verifique se o arquivo <code className="bg-amber-100 px-1 rounded">.env</code> está em <code className="bg-amber-100 px-1 rounded">c:\n\rv-portal\.env</code></li>
                        <li>• Reinicie o servidor após alterar o .env</li>
                        <li>• Abra o Console do navegador (F12) para ver os logs detalhados</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
