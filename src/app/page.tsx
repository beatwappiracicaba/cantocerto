import { HeroSection } from '@/components/home/HeroSection'
import { EventsSection } from '@/components/home/EventsSection'
import { GallerySection } from '@/components/home/GallerySection'
import { VIPSection } from '@/components/home/VIPSection'
import { ContactSection } from '@/components/home/ContactSection'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950">
      <Header />
      <HeroSection />
      <EventsSection />
      <GallerySection />
      <VIPSection />
      <ContactSection />
      <Footer />
    </main>
  )
}