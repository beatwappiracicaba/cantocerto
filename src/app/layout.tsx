import type { Metadata } from 'next'
import { Inter, Montserrat, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Canto Certo - A Casa de Shows de Piracicaba',
  description: 'A casa de shows mais premium de Piracicaba-SP. Shows, eventos especiais e experiências únicas.',
  keywords: ['casa de shows', 'piracicaba', 'eventos', 'shows', 'entretenimento', 'nightlife'],
  authors: [{ name: 'Canto Certo' }],
  openGraph: {
    title: 'Canto Certo - A Casa de Shows de Piracicaba',
    description: 'A casa de shows mais premium de Piracicaba-SP. Shows, eventos especiais e experiências únicas.',
    url: 'https://cantocerto.com.br',
    siteName: 'Canto Certo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Canto Certo - Casa de Shows',
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canto Certo - A Casa de Shows de Piracicaba',
    description: 'A casa de shows mais premium de Piracicaba-SP. Shows, eventos especiais e experiências únicas.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} ${playfair.variable}`}>
      <body className="font-sans bg-gray-950 text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}