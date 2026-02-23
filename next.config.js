/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para export estático (funciona com Cloudflare Pages)
  output: 'export',
  
  // Configurações de imagens para export estático
  images: {
    unoptimized: true,
  },
  
  // Configurações de segurança e performance
  poweredByHeader: false,
  
  // Desabilitar otimizações que podem causar problemas
  swcMinify: false,
  
  // Configuração do diretório de build
  distDir: 'out',
  
  // Configurações de ambiente
  env: {
    // Variáveis serão configuradas via Cloudflare Pages
  },
  
  // Configurações de rewrites para proxy do Supabase (funciona apenas em modo server)
  // Para export estático, configure CORS no dashboard do Supabase
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://beatwapproducoes.pages.dev' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ]
      }
    ]
  },
  
  // Desabilitar features que não funcionam em export estático
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig