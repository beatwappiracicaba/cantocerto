import { Metadata } from 'next'
import { EventsListing } from '@/components/events/EventsListing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Eventos - Canto Certo | Casa de Shows Piracicaba',
  description: 'Confira todos os próximos eventos no Canto Certo. Shows, festas e experiências únicas em Piracicaba. Compre seus ingressos online.',
  keywords: 'eventos, shows, festas, Piracicaba, Canto Certo, ingressos, música, entretenimento',
  openGraph: {
    title: 'Eventos - Canto Certo | Casa de Shows Piracicaba',
    description: 'Confira todos os próximos eventos no Canto Certo. Shows, festas e experiências únicas em Piracicaba.',
    url: 'https://cantocerto.com.br/events',
    siteName: 'Canto Certo',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://cantocerto.com.br/images/og-events.jpg',
        width: 1200,
        height: 630,
        alt: 'Eventos no Canto Certo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventos - Canto Certo | Casa de Shows Piracicaba',
    description: 'Confira todos os próximos eventos no Canto Certo. Shows, festas e experiências únicas em Piracicaba.',
    images: ['https://cantocerto.com.br/images/twitter-events.jpg']
  },
  alternates: {
    canonical: 'https://cantocerto.com.br/events'
  }
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        <EventsListing />
      </main>
      <Footer />
    </div>
  )
}