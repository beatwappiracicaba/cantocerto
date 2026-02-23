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
  
  // Desabilitar features que não funcionam em export estático
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig