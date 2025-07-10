import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Loading from '../components/ui/Loading'
import { useAuth } from '../context/AuthContext'
import { challengeService } from '../services/challengeService'
import { apiService } from '../services/api'
import { buildApiUrl } from '../config/api'
import type { Challenge, ChallengeParticipant } from '../types'
import { getChallengePalette } from '../utils/colorPalette';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    state: { user, loading: authLoading },
  } = useAuth()

  const [myChallenges, setMyChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [realParticipantsCount, setRealParticipantsCount] = useState<{ [challengeId: number]: number }>({})
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([])
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [participantsError, setParticipantsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyChallenges = async () => {
      setLoading(true)
      try {
        console.log('🔍 Fetching my challenges...')
        const response = await challengeService.getMyChallenges()
        console.log('📦 Raw response:', response)
        
        const data = (response as any).data || response
        console.log('📋 Processed data:', data)
        console.log('📊 Data length:', Array.isArray(data) ? data.length : 'Not an array')
        
        if (Array.isArray(data)) {
          data.forEach((challenge, index) => {
            // Normalizar el ID del reto (el backend devuelve challengeId, no id)
            const normalizedChallenge = {
              ...challenge,
              id: challenge.id || challenge.challengeId
            }
            
            console.log(`🎯 Challenge ${index}:`, {
              id: normalizedChallenge.id,
              challengeId: challenge.challengeId,
              name: challenge.name,
              participantsCount: challenge.participantsCount,
              fullChallenge: challenge
            })
            
            // Reemplazar el challenge con la versión normalizada
            data[index] = normalizedChallenge
          })
        }
        
        setMyChallenges(data as Challenge[])
        
        // Obtener el número real de participantes para cada reto
        if (Array.isArray(data)) {
          data.forEach(challenge => {
            const challengeId = challenge.id || (challenge as any).challengeId
            if (challengeId) {
              getRealParticipantsCount(challengeId)
            }
          })
        }
        
      } catch (err: any) {
        console.error('❌ Error loading my challenges:', err)
        setError(err.message || 'Error loading your challenges')
      } finally {
        setLoading(false)
      }
    }

    fetchMyChallenges()
  }, [])

  // Función para obtener el número real de participantes
  const getRealParticipantsCount = async (challengeId: number) => {
    try {
      const url = buildApiUrl(`/challenges/${challengeId}/participants`)
      const participants = await apiService.getJSON<ChallengeParticipant[]>(url)
      
      // Verificar si la respuesta tiene estructura anidada
      let participantsArray = participants
      if (participants && typeof participants === 'object' && !Array.isArray(participants)) {
        if ('data' in participants && Array.isArray((participants as any).data)) {
          participantsArray = (participants as any).data
        } else if ('participants' in participants && Array.isArray((participants as any).participants)) {
          participantsArray = (participants as any).participants
        } else {
          participantsArray = []
        }
      }
      
      const count = Array.isArray(participantsArray) ? participantsArray.length : 0
      console.log(`👥 Real participants count for challenge ${challengeId}:`, count)
      
      setRealParticipantsCount(prev => ({ ...prev, [challengeId]: count }))
      return count
    } catch (err) {
      console.error(`❌ Error getting participants count for challenge ${challengeId}:`, err)
      return 0
    }
  }

  // Función para cargar y mostrar participantes
  const handleViewParticipants = async (challenge: Challenge) => {
    console.log('🔘 Button clicked! Challenge:', challenge)
    
    // Usar challengeId si id no está disponible
    const challengeId = challenge.id || (challenge as any).challengeId
    
    if (!challenge || !challengeId) {
      console.error('❌ Invalid challenge or challenge.id:', challenge)
      return
    }

    console.log('👥 Loading participants for challenge:', {
      id: challengeId,
      name: challenge.name
    })

    setSelectedChallenge(challenge)
    setShowParticipantsModal(true)
    setParticipantsLoading(true)
    setParticipantsError(null)

    try {
      const url = buildApiUrl(`/challenges/${challengeId}/participants`)
      console.log('🌐 Calling URL:', url)
      
      const data = await apiService.getJSON<ChallengeParticipant[]>(url)
      console.log('👥 Raw participants data:', data)
      console.log('📊 Data type:', typeof data)
      console.log('📊 Is array:', Array.isArray(data))
      console.log('📊 Data length:', Array.isArray(data) ? data.length : 'Not an array')
      
      // Verificar si la respuesta tiene estructura anidada
      let participantsArray = data
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        console.log('🔍 Response is an object, checking for nested data...')
        if ('data' in data && Array.isArray((data as any).data)) {
          console.log('✅ Found nested data array')
          participantsArray = (data as any).data
        } else if ('participants' in data && Array.isArray((data as any).participants)) {
          console.log('✅ Found participants array')
          participantsArray = (data as any).participants
        } else {
          console.log('❌ No recognizable data structure found')
          participantsArray = []
        }
      }
      
      console.log('👥 Final participants array:', participantsArray)
      console.log('📊 Final array length:', Array.isArray(participantsArray) ? participantsArray.length : 'Not an array')
      
      if (Array.isArray(participantsArray)) {
        participantsArray.forEach((participant, index) => {
          console.log(`👤 Participant ${index}:`, {
            id: participant.id,
            name: participant.name,
            firstName: participant.firstName,
            lastName: participant.lastName,
            email: participant.email
          })
        })
      }
      
      setParticipants(participantsArray)
      
    } catch (err: any) {
      console.error('❌ Error loading participants:', err)
      console.error('❌ Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      })
      setParticipantsError(err.message || 'Error loading participants')
    } finally {
      setParticipantsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Checking authentication…" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Please log in to continue.</p>
      </div>
    )
  }

  const firstName = user.firstName?.split(' ')[0]
  const emailName = user.email?.split('@')[0]
  const displayName = firstName || emailName || 'there'

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      <Header active="dashboard" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Saludo */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Hi {displayName}!
          </h1>
          <p className="text-gray-600 mt-1">
            {/* 🔄 Frase actualizada */}
            Stay committed to your vision!
          </p>
        </div>



        

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#F5EFE8] rounded-lg flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Daily Evidence</h3>
                <p className="text-sm text-gray-600">Submit your daily proof</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/evidences')}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
            >
              Submit Evidence
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#F5EFE8] rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Progress</h3>
                <p className="text-sm text-gray-600">Check your statistics</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/evidences?tab=stats')}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
            >
              View Stats
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#F5EFE8] rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Join Challenges</h3>
                <p className="text-sm text-gray-600">Find new opportunities</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/challenges')}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
            >
              Browse Challenges
            </button>
          </div>
        </section>

        {/* My Challenges */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            My Challenges
          </h2>

          {loading && <p>Loading…</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && myChallenges.length === 0 && (
            <p className="text-gray-500">
              You haven’t joined any challenges yet.
            </p>
          )}

          {!loading && !error && myChallenges.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myChallenges.map(ch => {
                return (
                  <div
                    key={ch.id}
                    className="p-6 rounded-2xl shadow flex flex-col bg-white"
                  >
                    <img
                      src={ch.imageUrl}
                      alt={ch.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-medium mb-2 text-gray-900">
                      {ch.name}
                    </h3>
                    <p className="flex-grow mb-4 text-gray-600">
                      {ch.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{ch.durationDays} days</span>
                      <button
                        onClick={() => handleViewParticipants(ch)}
                        className="text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
                      >
                        {realParticipantsCount[ch.id] !== undefined
                          ? realParticipantsCount[ch.id]
                          : ch.participantsCount || 0} participants
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Modal de Participantes */}
        {showParticipantsModal && selectedChallenge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Participants: {selectedChallenge.name}
                </h3>
                <button
                  onClick={() => {
                    setShowParticipantsModal(false)
                    setSelectedChallenge(null)
                    setParticipants([])
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {participantsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-600">Loading participants...</p>
                </div>
              ) : participantsError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{participantsError}</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No participants yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {participants.map((participant, index) => (
                      <div
                        key={participant.id || index}
                        className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">
                            {participant.name
                              ? participant.name.charAt(0)
                              : participant.firstName
                              ? participant.firstName.charAt(0)
                              : 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {participant.name || `${participant.firstName || ''} ${participant.lastName || ''}`.trim()}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {participant.email}
                          </p>
                          {participant.joinedAt && (
                            <p className="text-xs text-gray-400">
                              Joined:{' '}
                              {new Date(participant.joinedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardPage
