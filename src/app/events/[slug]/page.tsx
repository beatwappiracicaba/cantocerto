import { Metadata } from 'next'
import { EventDetails } from '@/components/events/EventDetails'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { EventService } from '@/services/event.service'
import { notFound } from 'next/navigation'

// Generate static parameters for all events
export async function generateStaticParams() {
  // Para export estático, vamos usar eventos pré-definidos
  // Isso evita dependência do banco durante o build
  return [
    { slug: 'green-valley-night' },
    { slug: 'vintage-culture-night' },
    { slug: 'chemical-surf-live' },
    { slug: 'alok-unplugged' },
    { slug: 'house-music-festival' }
  ]
}

// Generate metadata dynamically based on the event
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { event } = await EventService.getEventBySlug(params.slug)
  
  if (!event) {
    return {
      title: 'Evento não encontrado - Canto Certo',
      description: 'Evento não encontrado',
    }
  }

  return {
    title: `${event.title} - Canto Certo | Casa de Shows Piracicaba`,
    description: event.description || `Participe do ${event.title} no Canto Certo. Compre seus ingressos agora!`,
    keywords: `${event.title}, ${event.city}, Canto Certo, casa de shows, eventos Piracicaba`,
    openGraph: {
      title: `${event.title} - Canto Certo | Casa de Shows Piracicaba`,
      description: event.description || `Participe do ${event.title} no Canto Certo.`,
      url: `https://cantocerto.com.br/events/${event.slug}`,
      siteName: 'Canto Certo',
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: event.bannerUrl || 'https://cantocerto.com.br/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: `${event.title} no Canto Certo`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} - Canto Certo | Casa de Shows Piracicaba`,
      description: event.description || `Participe do ${event.title} no Canto Certo.`,
      images: [event.bannerUrl || 'https://cantocerto.com.br/images/twitter-default.jpg']
    },
    alternates: {
      canonical: `https://cantocerto.com.br/events/${event.slug}`
    }
  }
}

interface EventPageProps {
  params: {
    slug: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { event } = await EventService.getEventBySlug(params.slug)
  
  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        <EventDetails event={event} />
      </main>
      <Footer />
    </div>
  )
}