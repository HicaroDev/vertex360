-- VERIFICAÇÃO: Listar todos os clientes
SELECT id, name, company FROM clients ORDER BY created_at DESC;

-- Se não houver clientes, vamos criar um de teste:
INSERT INTO clients (name, company, email, phone, progress, health, next_meeting, status)
VALUES (
    'João Ferreira',
    'Ferreira Logística e Distribuidora',
    'joao@ferreira.com',
    '(11) 98765-4321',
    72,
    'Boa',
    '2026-02-22',
    'Ativo'
)
ON CONFLICT DO NOTHING
RETURNING id, name, company;

-- Copie o ID retornado e use na URL:
-- http://localhost:3000/admin/clients/[COLE_O_ID_AQUI]
