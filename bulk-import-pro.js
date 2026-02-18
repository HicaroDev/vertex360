
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

/**
 * BULK IMPORT PRO - METODO VERTEX 360
 * Versão: 2.0 (Fevereiro 2026)
 * 
 * Funcionalidades:
 * - Mapeamento inteligente de categorias
 * - Detecção automática de status (OK = publicado)
 * - Ordenação cronológica baseada no título
 * - Tratamento de arquivos HTML do Notion
 */

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// CONFIGURAÇÃO DO CLIENTE (Altere aqui para novos clientes)
const CLIENT_ID = '9e4e1fec-2e0a-428d-843b-63bb398e5c09'; // Ferreira
const BASE_DIR = 'C:/n/PRODUTOS RV/METÓDO VERTEX 360/Clientes/Ferreira Logística e Distribuidora';

function walkDirectory(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDirectory(fullPath));
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

function determineCategory(filePath) {
    const lower = filePath.toLowerCase();
    if (lower.includes('reuniões') || lower.includes('reunioes')) return 'Reuniões - Ferreira Distribuidora';
    if (lower.includes('diagnóstico') || lower.includes('diagnostico')) return 'Diagnóstico - Ferreira Distribuidora';
    if (lower.includes('apresentação') || lower.includes('apresentacao')) return 'Apresentação e Estruturação - Ferreira Distribuidora';
    if (lower.includes('desenvolvimento')) return 'Desenvolvimento - Ferreira Distribuidora';
    return 'Dados Empresa';
}

function extractMetadata(html, filePath) {
    const match = html.match(/<title>([^<]+)<\/title>/i);
    let title = match ? match[1].replace(/\s[a-f0-9]{32}/i, '').trim() : path.basename(filePath, '.html');

    // 1. Status
    const status = title.toLowerCase().includes('ok') ? 'published' : 'analyzing';

    // 2. Ordem (baseada na data no título)
    let orderIndex = 0;
    const dateMatch = title.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (dateMatch) {
        const [_, day, month, year] = dateMatch;
        const dateObj = new Date(year, month - 1, day);
        orderIndex = Math.floor(dateObj.getTime() / 100000);
    }

    return { title, status, orderIndex };
}

async function bulkImport() {
    console.log('🚀 Iniciando Bulk Import Pro...\n');
    const files = walkDirectory(BASE_DIR);
    console.log(`📁 ${files.length} arquivos encontrados.\n`);

    for (const filePath of files) {
        try {
            const html = fs.readFileSync(filePath, 'utf8');
            const { title, status, orderIndex } = extractMetadata(html, filePath);
            const category = determineCategory(filePath);

            console.log(`⏳ Processando: ${title}...`);

            const { error } = await supabase.from('documents').upsert({
                client_id: CLIENT_ID,
                title: title,
                category: category,
                content: html,
                status: status,
                order_index: orderIndex,
                last_edit: new Date().toLocaleDateString('pt-BR')
            }, {
                onConflict: 'client_id,title',
                ignoreDuplicates: false
            });

            if (error) throw error;
            console.log(`  ✅ [${status.toUpperCase()}] Ord: ${orderIndex}`);

        } catch (err) {
            console.error(`  ❌ Erro: ${err.message}`);
        }
    }
}

bulkImport();
