# Canto Certo - Sistema de Gestão de Eventos

Sistema completo para gestão de eventos, vendas de ingressos e galeria de fotos.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados e autenticação
- **Stripe** - Pagamentos
- **Cloudflare Pages** - Hospedagem

## 📋 Funcionalidades

- ✅ Sistema de autenticação completo
- ✅ Gestão de eventos
- ✅ Venda de ingressos
- ✅ Galeria de fotos com download
- ✅ Integração com WhatsApp (19) 97155-3424
- ✅ Dashboard administrativo
- ✅ Página VIP para clientes
- ✅ Deploy no Cloudflare Pages

## 🛠️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/beatwappiracicaba/cantocerto.git
cd cantocerto

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar em desenvolvimento
npm run dev
```

## 🌐 Deploy

### Cloudflare Pages

```bash
# Build de produção
npm run build

# Deploy
npm run deploy
```

### Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_stripe
STRIPE_SECRET_KEY=sua_chave_secreta_stripe
NEXT_PUBLIC_SITE_URL=sua_url
NEXT_PUBLIC_SITE_NAME=Canto Certo
```

## 📁 Estrutura do Projeto

```
src/
├── app/              # Rotas Next.js 13+
├── components/       # Componentes React
├── services/       # Serviços e APIs
├── hooks/          # Hooks customizados
├── lib/            # Utilitários
└── types/          # Tipos TypeScript
```

## 📞 Contato

WhatsApp: (19) 97155-3424

## 📄 Licença

Este projeto está sob a licença MIT.