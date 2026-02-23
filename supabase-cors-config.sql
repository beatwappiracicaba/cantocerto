// Configuração para resolver problemas de CORS com Supabase
// Este arquivo deve ser executado no console do Supabase ou como migration

-- Configuração de CORS para o Supabase
-- Execute isso no SQL Editor do seu dashboard do Supabase

-- 1. Configurar CORS para o seu domínio
ALTER DATABASE postgres SET cors_allowed_origins = 'https://beatwapproducoes.pages.dev';

-- 2. Criar função para adicionar headers CORS (se necessário)
CREATE OR REPLACE FUNCTION add_cors_headers()
RETURNS void AS $$
BEGIN
  -- Headers CORS serão adicionados automaticamente pelo Supabase
  -- Esta função é apenas para referência
END;
$$ LANGUAGE plpgsql;

-- 3. Configurar políticas de segurança (RLS) para permitir acesso externo
-- Exemplo para tabela de usuários (ajuste conforme suas tabelas)

-- Política para leitura pública (se aplicável)
-- CREATE POLICY "Permitir leitura pública" ON users
--   FOR SELECT USING (true);

-- Política para inserção com autenticação
-- CREATE POLICY "Permitir inserção autenticada" ON users
--   FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Verificar configurações atuais
SELECT name, setting FROM pg_settings WHERE name LIKE '%cors%' OR name LIKE '%origin%';

-- 5. Configuração adicional para autenticação externa
-- No dashboard do Supabase, vá para:
-- Authentication > Settings > Auth Settings
-- 
-- Configure:
-- - Site URL: https://beatwapproducoes.pages.dev
-- - Redirect URLs: https://beatwapproducoes.pages.dev/auth/callback
-- - CORS Origins: https://beatwapproducoes.pages.dev

-- 6. Verificar se as configurações foram aplicadas
SHOW cors_allowed_origins;