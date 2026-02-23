# Configuração de CORS no Supabase

## 🎯 Objetivo
Resolver o erro de CORS entre o frontend (https://beatwapproducoes.pages.dev) e o Supabase.

## 📋 Passos para Configurar CORS no Supabase

### 1. Acessar o Dashboard do Supabase
1. Vá para https://supabase.com
2. Faça login na sua conta
3. Selecione o projeto "cantocerto"

### 2. Configurar Authentication Settings
1. No painel lateral, clique em **Authentication**
2. Vá para a aba **Settings**
3. Em **General**, configure:
   - **Site URL**: `https://beatwapproducoes.pages.dev`
   - **JWT Expiry**: `3600` (ou conforme preferir)

### 3. Configurar CORS Origins
1. Em **Authentication > Settings**, procure por **CORS Origins**
2. Adicione: `https://beatwapproducoes.pages.dev`
3. Salve as alterações

### 4. Configurar Redirect URLs
1. Em **Authentication > Settings**, procure por **Redirect URLs**
2. Adicione:
   - `https://beatwapproducoes.pages.dev/auth/callback`
   - `https://beatwapproducoes.pages.dev/`
3. Salve as alterações

### 5. Executar SQL de Configuração (Opcional)
1. Vá para **SQL Editor** no dashboard
2. Cole o conteúdo do arquivo `supabase-cors-config.sql`
3. Execute para verificar configurações

### 6. Verificar Configurações de Segurança (RLS)
Se estiver usando Row Level Security (RLS), certifique-se de que as políticas permitam acesso do domínio:

```sql
-- Exemplo de política para leitura pública (ajuste conforme necessário)
CREATE POLICY "Permitir leitura pública" ON events
  FOR SELECT USING (true);

-- Exemplo de política para usuários autenticados
CREATE POLICY "Permitir acesso autenticado" ON users
  FOR ALL USING (auth.uid() = id);
```

### 7. Configurar Variáveis de Ambiente
No arquivo `.env.local` do seu projeto, certifique-se de que as URLs estão corretas:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://sua-instancia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

### 8. Testar a Configuração
Após aplicar as configurações:
1. Faça deploy novamente: `npm run deploy`
2. Teste o login no site: https://beatwapproducoes.pages.dev/admin
3. Verifique o console do navegador para erros de CORS

## 🚨 Problemas Comuns

### Erro: "No 'Access-Control-Allow-Origin' header"
**Solução**: Verifique se adicionou o domínio correto nas configurações de CORS Origins.

### Erro: "Redirect URI mismatch"
**Solução**: Adicione a URL completa nas Redirect URLs do Supabase.

### Erro: "JWT expired"
**Solução**: Aumente o JWT Expiry nas configurações de autenticação.

## 📞 Suporte
Se o problema persistir:
1. Verifique o console do navegador (F12)
2. Teste com `curl` para verificar headers da API
3. Confira as logs do Supabase em **Logs** no dashboard

## 🔄 Atualização de Código
O código do projeto já foi atualizado com headers CORS no arquivo `src/lib/supabase.ts`.