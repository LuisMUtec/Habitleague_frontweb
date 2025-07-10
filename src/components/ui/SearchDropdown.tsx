import React from 'react'
import type { SearchResult } from '../../services/searchService'

interface SearchDropdownProps {
  results: SearchResult[]
  isVisible: boolean
  onSelect: (result: SearchResult) => void
  onClose: () => void
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  isVisible,
  onSelect,
  onClose,
}) => {
  if (!isVisible || results.length === 0) return null

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'page':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      case 'category':
        return (
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      case 'challenge':
        return (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'page':
        return 'Page'
      case 'category':
        return 'Category'
      case 'challenge':
        return 'Challenge'
      default:
        return ''
    }
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {results.map((result, index) => (
        <button
          key={`${result.type}-${index}`}
          onClick={() => {
            onSelect(result)
            onClose()
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
        >
          <div className="flex items-center space-x-3">
            {getIcon(result.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {result.title}
                </p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {getTypeLabel(result.type)}
                </span>
              </div>
              {result.description && (
                <p className="text-xs text-gray-500 truncate mt-1">
                  {result.description}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default SearchDropdown 