
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAndSuggest() {
    console.log('--- Verificando Colunas de Acesso ---');
    const { error } = await supabase
        .from('clients')
        .insert({
            name: 'Schema Test',
            company: 'Test',
            access_login: 'test',
            access_password: 'test'
        });

    if (error && error.message.includes('column "access_login" does not exist')) {
        console.log('Status: Colunas de login/senha NÃO encontradas no banco.');
        console.log('Ação Necessária: Execute o SQL abaixo no editor do Supabase:');
        console.log('\nALTER TABLE clients ADD COLUMN IF NOT EXISTS access_login TEXT;');
        console.log('ALTER TABLE clients ADD COLUMN IF NOT EXISTS access_password TEXT;\n');
    } else {
        console.log('✅ Colunas de acesso detectadas ou erro diferente:', error?.message || 'Nenhum erro!');
        // Se criou o teste, deletar
        await supabase.from('clients').delete().eq('name', 'Schema Test');
    }
}

checkAndSuggest();
