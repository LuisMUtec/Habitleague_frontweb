// src/components/layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { searchService, type SearchResult } from '../../services/searchService'
import SearchDropdown from '../ui/SearchDropdown'
import heroImg from '../../assets/hero.png'
import maleAvatar from '../../assets/MALE.png'
import femaleAvatar from '../../assets/FEMALE.png'

interface HeaderProps {
  active?: 'dashboard' | 'challenges' | 'payments' | 'profile' | 'evidences'
}

const Header: React.FC<HeaderProps> = ({ active }) => {
  const {
    state: { user },
  } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ¿El usuario subió su propia foto?
  const hasCustomPhoto =
    typeof user?.profilePhotoUrl === 'string' &&
    user.profilePhotoUrl.trim() !== ''

  // ¿Eligió avatar femenino?
  const isFemale =
    !!user?.avatarId && user.avatarId.toUpperCase() === 'FEMALE'

  // Prioriza foto personalizada, luego avatar elegido
  const profileSrc = hasCustomPhoto
    ? user!.profilePhotoUrl!
    : isFemale
    ? femaleAvatar
    : maleAvatar

  // Función para buscar con debounce
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchService.search(query)
      setSearchResults(results)
      setShowDropdown(results.length > 0)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setShowDropdown(false)
    } finally {
      setIsSearching(false)
    }
  }

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchTerm.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchTerm)
      }, 300)
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault()
      handleSelectResult(searchResults[0])
    } else if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault()
      // Redirigir a NotFoundPage con el término de búsqueda
      navigate('/not-found', { state: { searchTerm: searchTerm.trim() } })
      setSearchTerm('')
      setShowDropdown(false)
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      searchInputRef.current?.blur()
    }
  }

  const handleSelectResult = (result: SearchResult) => {
    setSearchTerm('')
    setShowDropdown(false)
    
    if (result.type === 'category') {
      // Para categorías, navegar a challenges y seleccionar la categoría
      navigate(result.path, { state: { selectedCategory: result.data?.category } })
    } else {
      // Para páginas y challenges, navegar directamente
      navigate(result.path)
    }
  }

  const handleCloseDropdown = () => {
    setShowDropdown(false)
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center shrink-0">
            <img src={heroImg} alt="Habit League" className="h-8 w-auto" />
            <span className="ml-2 font-bold text-lg whitespace-nowrap">
              Habit League
            </span>
          </Link>

          {/* Links (ocultos en móvil) */}
          <div className="hidden md:flex md:space-x-6 lg:space-x-10">
            <Link
              to="/dashboard"
              className={`text-sm font-medium ${
                active === 'dashboard'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/challenges"
              className={`text-sm font-medium ${
                active === 'challenges'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Challenges
            </Link>
            <Link
              to="/payments"
              className={`text-sm font-medium ${
                active === 'payments'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Payments
            </Link>
            <Link
              to="/evidences"
              className={`text-sm font-medium ${
                active === 'evidences'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Evidences
            </Link>
          </div>

          {/* Search + Avatar */}
          <div className="flex items-center space-x-2 md:space-x-4 w-full max-w-xs md:max-w-sm lg:max-w-md">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowDropdown(true)
                  }
                }}
                placeholder="Search pages, categories, challenges..."
                className="block w-full px-3 pl-10 py-1 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {isSearching && (
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              
              <SearchDropdown
                results={searchResults}
                isVisible={showDropdown}
                onSelect={handleSelectResult}
                onClose={handleCloseDropdown}
              />
            </div>
            <button onClick={() => navigate('/profile')} className="flex-shrink-0">
              <img
                src={profileSrc}
                alt="User avatar"
                className="h-8 w-8 rounded-full object-cover"
                onError={e => {
                  // Si la URL falla, vuelve al avatar elegido
                  e.currentTarget.src = isFemale ? femaleAvatar : maleAvatar
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
