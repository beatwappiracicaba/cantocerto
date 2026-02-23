# Deploy no Cloudflare Pages - Instruções

## 📋 Pré-requisitos

1. Conta no Cloudflare (gratuita)
2. Node.js 18+ instalado
3. Acesso ao terminal/prompt de comando

## 🔧 Configurações Realizadas

### 1. Arquivos Criados/Modificados

- ✅ `next.config.js` - Configurado para export estático
- ✅ `wrangler.toml` - Configuração do Cloudflare Pages
- ✅ `.env.example` - Template de variáveis de ambiente
- ✅ `package.json` - Scripts de deploy adicionados

### 2. Configurações do Next.js

O projeto foi configurado para export estático com:
- `output: 'export'` - Gera HTML estático
- `images.unoptimized: true` - Imagens otimizadas para static export
- `trailingSlash: true` - URLs amigáveis
- `distDir: 'out'` - Diretório de build

### 3. Scripts Disponíveis

```bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Deploy para produção
npm run deploy

# Deploy para ambiente de preview
npm run deploy:preview
```

## 🚀 Passos para Deploy

### 1. Autenticação no Cloudflare

```bash
npx wrangler login
```

### 2. Configurar Variáveis de Ambiente

No Cloudflare Dashboard:
1. Vá para seu projeto → Settings → Environment variables
2. Adicione as variáveis do arquivo `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (opcional)
   - `STRIPE_SECRET_KEY` (opcional)
   - `NEXT_PUBLIC_SITE_URL` (sua URL do Cloudflare)
   - `NEXT_PUBLIC_SITE_NAME`

### 3. Deploy Inicial

```bash
npm run deploy
```

### 4. Configurar Domínio Customizado (Opcional)

1. No Cloudflare Dashboard, vá para Pages
2. Selecione seu projeto
3. Vá para Custom domains
4. Adicione seu domínio

## 📁 Estrutura do Build

O build gera os arquivos na pasta `out/`:
- HTML estático de cada página
- Assets otimizados (CSS, JS, imagens)
- Arquivos de configuração

## ⚠️ Limitações do Export Estático

- ✅ Funcionalidades que funcionam:
  - Páginas estáticas
  - Rotas dinâmicas com `generateStaticParams()`
  - Imagens otimizadas
  - CSS e JS
  - Metadados dinâmicos

- ❌ Funcionalidades que não funcionam:
  - API Routes (precisam ser convertidas para Cloudflare Functions)
  - Server-side rendering em tempo real
  - WebSockets
  - Sessions do Next.js

## 🔄 Atualizações Futuras

Para atualizar o site:

1. Faça as alterações no código
2. Execute `npm run build` para testar
3. Execute `npm run deploy` para publicar

## 🆘 Troubleshooting

### Build falha
- Verifique se todas as importações estão corretas
- Certifique-se de que não há erros de TypeScript
- Verifique o arquivo `next.config.js`

### Deploy falha
- Verifique se está logado no wrangler: `npx wrangler whoami`
- Confirme as variáveis de ambiente no Cloudflare
- Verifique os logs no Cloudflare Dashboard

### Páginas não encontradas (404)
- Verifique se `generateStaticParams()` está configurado corretamente
- Confirme que os slugs dos eventos estão corretos

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do build
2. Consulte a documentação do [Cloudflare Pages](https://developers.cloudflare.com/pages/)
3. Verifique a documentação do [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## 🎯 Status Atual

✅ **PRONTO PARA DEPLOY!**

O projeto está configurado e o build está funcionando corretamente. Basta seguir os passos acima para fazer o deploy no Cloudflare Pages.