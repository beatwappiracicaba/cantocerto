'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Crown, LayoutDashboard, AlertTriangle, Image as ImageIcon, Calendar, Users, Upload, Eye, Trash2, X } from 'lucide-react'
import { GalleryManager } from '@/components/dashboard/GalleryManager'

type DashboardSection = 'overview' | 'events' | 'gallery' | 'vips'

export default function DashboardPage() {
  const { user, isLoading, hasRole } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!hasRole('manager')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center text-white text-center p-8">
        <div>
          <AlertTriangle className="w-20 h-20 mx-auto text-red-400 mb-6" />
          <h1 className="text-4xl font-bold mb-2">Acesso Negado</h1>
          <p className="text-xl text-gray-300">Você não tem permissão para acessar esta página.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-8 bg-yellow-500 text-black font-bold py-3 px-6 rounded-full hover:bg-yellow-400 transition-all"
          >
            Voltar para a Home
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'gallery':
        return (
          <GalleryManager
            onItemAdded={(item) => console.log('Imagem adicionada:', item)}
            onItemDeleted={(id) => console.log('Imagem deletada:', id)}
          />
        )
      case 'events':
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Gerenciar Eventos</h3>
            <p className="text-gray-400">Funcionalidade de gerenciamento de eventos será implementada aqui.</p>
          </div>
        )
      case 'vips':
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-yellow-400">Gerenciar VIPs</h3>
            <p className="text-gray-400">Funcionalidade de gerenciamento de VIPs será implementada aqui.</p>
          </div>
        )
      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveSection('events')}
              className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-left hover:bg-gray-700/50 transition-colors"
            >
              <Calendar className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="font-bold text-xl mb-2">Gerenciar Eventos</h3>
              <p className="text-gray-400">Adicionar, editar e remover eventos.</p>
            </button>
            <button
              onClick={() => setActiveSection('gallery')}
              className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-left hover:bg-gray-700/50 transition-colors"
            >
              <ImageIcon className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="font-bold text-xl mb-2">Gerenciar Galeria</h3>
              <p className="text-gray-400">Fazer upload de fotos dos shows.</p>
            </button>
            <button
              onClick={() => setActiveSection('vips')}
              className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-left hover:bg-gray-700/50 transition-colors"
            >
              <Users className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="font-bold text-xl mb-2">Gerenciar VIPs</h3>
              <p className="text-gray-400">Administrar a lista de clientes VIP.</p>
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-950/80 backdrop-blur-lg border-b border-yellow-500/30 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Crown className="w-10 h-10 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold">Painel do Gerente</h1>
            <p className="text-sm text-gray-400">Gerenciamento do Site Canto Certo</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {activeSection !== 'overview' && (
            <button
              onClick={() => setActiveSection('overview')}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              ← Voltar ao Painel
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Sair do Painel
          </button>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {activeSection === 'overview' && (
            <h2 className="text-3xl font-semibold mb-8 text-yellow-400">
              <LayoutDashboard className="inline-block w-8 h-8 mr-3" />
              Bem-vindo, {user?.name}!
            </h2>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
