# 🚀 Guia Completo: Configurar Supabase para Resolver CORS

## 📋 Resumo do Problema
O erro de CORS ocorre quando o frontend em `https://beatwapproducoes.pages.dev` tenta acessar o Supabase, mas as configurações de CORS não estão corretas.

## 🔧 Solução Completa

### 1. 📱 Dashboard do Supabase - Configurações Essenciais

#### A. Authentication Settings
1. Acesse: https://app.supabase.com/project/[seu-projeto]/auth/settings
2. Configure:
   - **Site URL**: `https://beatwapproducoes.pages.dev`
   - **JWT Expiry**: `3600` (1 hora)
   - **Enable Email Confirmations**: `true` (se desejar)

#### B. CORS Origins
1. Em **Authentication > Settings** 
2. Role para baixo até encontrar **CORS Origins**
3. Adicione exatamente: `https://beatwapproducoes.pages.dev`
4. **Importante**: Não adicione barra no final

#### C. Redirect URLs
1. Em **Authentication > Settings**
2. Em **Redirect URLs**, adicione:
   ```
   https://beatwapproducoes.pages.dev/auth/callback
   https://beatwapproducoes.pages.dev/
   ```

### 2. 🔐 Configuração de Segurança (RLS)

#### Ativar RLS nas tabelas principais:
```sql
-- Para tabela de usuários
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política básica para leitura pública (se aplicável)
CREATE POLICY "Permitir leitura pública" ON users
  FOR SELECT USING (true);

-- Política para usuários autenticados modificarem próprio perfil
CREATE POLICY "Usuários podem editar próprio perfil" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Para tabela de eventos (exemplo)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eventos visíveis publicamente" ON events
  FOR SELECT USING (true);
```

### 3. 📝 Arquivo .env.local - Configuração Correta

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-chave-anon]
SUPABASE_SERVICE_ROLE_KEY=[sua-service-role-key]

# Site Configuration - IMPORTANTE para CORS
NEXT_PUBLIC_SITE_URL=https://beatwapproducoes.pages.dev
NEXT_PUBLIC_SITE_NAME=Canto Certo
```

### 4. 🔄 Atualização no Código - src/lib/supabase.ts

O código já foi atualizado com:
```typescript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'canto-certo-auth',
  },
  global: {
    headers: {
      'x-application-name': 'canto-certo',
      'Access-Control-Allow-Origin': 'https://beatwapproducoes.pages.dev',
      'Access-Control-Allow-Credentials': 'true',
    },
  },
  // ... resto da configuração
})
```

### 5. 🚀 Deploy para Cloudflare Pages

```bash
# 1. Build do projeto
npm run build:static

# 2. Deploy
npm run deploy
```

### 6. ✅ Verificação Final

#### Teste no navegador:
1. Acesse: https://beatwapproducoes.pages.dev
2. Abra o console (F12)
3. Tente fazer login
4. Verifique se não há mais erros de CORS

#### Teste com curl (opcional):
```bash
curl -H "Origin: https://beatwapproducoes.pages.dev" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://[seu-projeto].supabase.co/auth/v1/token
```

## 🚨 Erros Comuns e Soluções

### ❌ "No 'Access-Control-Allow-Origin' header"
**Causa**: Domínio não adicionado nas CORS Origins
**Solução**: Verifique o passo 1-B

### ❌ "Redirect URI mismatch"
**Causa**: URL de callback não configurada
**Solução**: Verifique o passo 1-C

### ❌ "JWT expired"
**Causa**: Token JWT com tempo de expiração curto
**Solução**: Aumente o JWT Expiry no passo 1-A

### ❌ "Unauthorized" ao acessar dados
**Causa**: Políticas RLS não configuradas
**Solução**: Configure as políticas no passo 2

## 📞 Se o Problema Persistir

1. **Verifique os logs**: Dashboard Supabase > Logs
2. **Teste localmente**: `npm run dev` e acesse http://localhost:3000
3. **Confira as variáveis**: Certifique-se que `.env.local` está correto
4. **Clear cache**: Limpe o cache do navegador e do Cloudflare

## 🎯 Checklist Final

- [ ] Site URL configurado: `https://beatwapproducoes.pages.dev`
- [ ] CORS Origins adicionado: `https://beatwapproducoes.pages.dev`
- [ ] Redirect URLs configuradas
- [ ] RLS ativado nas tabelas (se necessário)
- [ ] Variáveis de ambiente atualizadas
- [ ] Deploy feito no Cloudflare
- [ ] Teste de login realizado com sucesso

Após seguir todos estes passos, o erro de CORS deve estar resolvido! 🎉