import { apiService } from './api'
import { buildApiUrl } from '../config/api'
import type { Challenge } from '../types'

export interface SearchResult {
  type: 'page' | 'category' | 'challenge'
  title: string
  description?: string
  path: string
  data?: any
}

export const searchService = {
  // Buscar challenges por nombre
  async searchChallenges(query: string): Promise<Challenge[]> {
    try {
      // Por ahora, intentamos obtener todos los challenges y filtrar localmente
      // hasta que el backend tenga el endpoint de búsqueda
      const url = buildApiUrl('/challenges')
      const data = await apiService.getJSON<Challenge[]>(url)
      
      // Filtrar por nombre o descripción que contenga la query
      const filtered = data.filter(challenge => 
        challenge.name.toLowerCase().includes(query.toLowerCase()) ||
        challenge.description.toLowerCase().includes(query.toLowerCase()) ||
        challenge.category.toLowerCase().includes(query.toLowerCase())
      )
      
      return filtered.slice(0, 5) // Limitar a 5 resultados
    } catch (error) {
      console.error('Error searching challenges:', error)
      return []
    }
  },

  // Obtener todas las categorías disponibles
  getCategories(): { key: string; label: string; path: string }[] {
    return [
      { key: 'mindfulness', label: 'Mindfulness', path: '/challenges' },
      { key: 'fitness', label: 'Fitness', path: '/challenges' },
      { key: 'productivity', label: 'Productivity', path: '/challenges' },
      { key: 'lifestyle', label: 'Lifestyle', path: '/challenges' },
      { key: 'health', label: 'Health', path: '/challenges' },
      { key: 'coding', label: 'Coding', path: '/challenges' },
      { key: 'reading', label: 'Reading', path: '/challenges' },
      { key: 'finance', label: 'Finance', path: '/challenges' },
      { key: 'learning', label: 'Learning', path: '/challenges' },
      { key: 'writing', label: 'Writing', path: '/challenges' },
      { key: 'creativity', label: 'Creativity', path: '/challenges' },
    ]
  },

  // Obtener páginas disponibles
  getPages(): { key: string; label: string; path: string }[] {
    return [
      { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
      { key: 'challenges', label: 'Challenges', path: '/challenges' },
      { key: 'payments', label: 'Payments', path: '/payments' },
      { key: 'profile', label: 'Profile', path: '/profile' },
    ]
  },

  // Función principal de búsqueda
  async search(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = []
    const term = query.trim().toLowerCase()

    if (!term) return results

    // Buscar páginas
    const pages = this.getPages()
    const matchingPages = pages.filter(page => 
      page.key.includes(term) || page.label.toLowerCase().includes(term)
    )
    results.push(...matchingPages.map(page => ({
      type: 'page' as const,
      title: page.label,
      description: `Go to ${page.label}`,
      path: page.path
    })))

    // Buscar categorías
    const categories = this.getCategories()
    const matchingCategories = categories.filter(cat => 
      cat.key.includes(term) || cat.label.toLowerCase().includes(term)
    )
    results.push(...matchingCategories.map(cat => ({
      type: 'category' as const,
      title: cat.label,
      description: `Browse ${cat.label} challenges`,
      path: cat.path,
      data: { category: cat.key }
    })))

    // Buscar challenges específicos
    try {
      const challenges = await this.searchChallenges(query)
      results.push(...challenges.slice(0, 5).map(challenge => ({
        type: 'challenge' as const,
        title: challenge.name,
        description: challenge.description,
        path: `/challenges/${challenge.id}`,
        data: challenge
      })))
    } catch (error) {
      console.error('Error searching challenges:', error)
    }

    return results
  }
} 