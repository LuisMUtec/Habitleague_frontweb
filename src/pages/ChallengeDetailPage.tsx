import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import { challengeService } from '../services/challengeService'
import { locationService } from '../services/locationService'
import { apiService } from '../services/api'
import { buildApiUrl } from '../config/api'
import type { Challenge, ChallengeParticipant, Location } from '../types'
import maleAvatar from '../assets/MALE.png'
import femaleAvatar from '../assets/FEMALE.png'

const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [challengeLocation, setChallengeLocation] = useState<Location | null>(null)
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return

      setLoading(true)
      setError(null)
      try {
        const challengeId = parseInt(id)
        
        // Cargar challenge y ubicación en paralelo
        const [challengeResponse, locationResponse] = await Promise.all([
          challengeService.getChallengeById(challengeId),
          locationService.getLocationByChallenge(challengeId).catch(err => {
            console.log('⚠️ Could not fetch challenge location:', err.message)
            return null
          })
        ])
        
        const challengeData = (challengeResponse as any).data || challengeResponse
        
        console.log('🔍 Challenge data from backend:', challengeData)
        console.log('🔍 Location data from backend:', locationResponse)
        
        // Intentar extraer información de ubicación de diferentes posibles estructuras
        let challengeWithLocation = { ...challengeData }
        
        // Si obtuvimos la ubicación del servicio específico
        if (locationResponse && typeof locationResponse === 'object' && 'latitude' in locationResponse) {
          challengeWithLocation.location = {
            latitude: (locationResponse as Location).latitude,
            longitude: (locationResponse as Location).longitude,
            locationName: (locationResponse as Location).locationName,
            toleranceRadius: (locationResponse as Location).toleranceRadius
          }
          setChallengeLocation(locationResponse as Location)
          console.log('✅ Location found via locationService:', challengeWithLocation.location)
        }
        // Si no hay location pero hay campos de ubicación directos en el challenge
        else if (!challengeData.location && (challengeData.latitude || challengeData.longitude || challengeData.locationName)) {
          challengeWithLocation.location = {
            latitude: challengeData.latitude,
            longitude: challengeData.longitude,
            locationName: challengeData.locationName || 'Specified Location',
            toleranceRadius: challengeData.toleranceRadius || 50
          }
          console.log('🔧 Extracted location from direct properties:', challengeWithLocation.location)
        }
        // Si hay location en la estructura del challenge
        else if (challengeData.location && typeof challengeData.location === 'object') {
          console.log('✅ Location found in challenge data:', challengeData.location)
        }
        
        setChallenge(challengeWithLocation as Challenge)
      } catch (err: any) {
        console.error('❌ Error loading challenge:', err)
        setError(err.message || 'Error loading challenge')
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [id])

  const fetchParticipants = async () => {
    if (!id) return

    // Validate that id is a valid number
    const challengeId = parseInt(id)
    if (isNaN(challengeId)) {
      console.error('Invalid challenge ID:', id)
      return
    }

    setParticipantsLoading(true)
    try {
      // Use the same method as Popular Challenges that works
      const url = buildApiUrl(`/challenges/${challengeId}/participants`)
      const data = await apiService.getJSON<ChallengeParticipant[]>(url)
      setParticipants(data)
      
    } catch (err: any) {
      console.error('Error loading participants:', err)
    } finally {
      setParticipantsLoading(false)
    }
  }

  const handleViewParticipants = () => {
    if (!showParticipants) {
      fetchParticipants()
    }
    setShowParticipants(!showParticipants)
  }

  const handleJoinChallenge = () => {
    // Navegar a la página de challenges y abrir el modal de unirse
    navigate('/challenges', { 
      state: { 
        joinChallengeId: id,
        joinChallenge: challenge 
      } 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="challenges" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading challenge...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="challenges" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error || 'Challenge not found'}</p>
            <button
              onClick={() => navigate('/challenges')}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              Back to Challenges
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      <Header active="challenges" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/challenges')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Challenges
        </button>

        {/* Challenge Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Challenge Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={challenge.imageUrl}
              alt={challenge.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {challenge.name}
              </h1>
              <div className="flex items-center space-x-4 text-white">
                <span className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {challenge.category}
                </span>
                <span className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  ${challenge.entryFee}
                </span>
                <span className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {challenge.durationDays} days
                </span>
              </div>
            </div>
          </div>

          {/* Challenge Content */}
          <div className="p-6 md:p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
            </div>

            {/* Rules */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Rules</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{challenge.rules}</p>
              </div>
            </div>

            {/* Challenge Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Challenge Details</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date:</span>
                    <span>{new Date(challenge.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{challenge.durationDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <span>${challenge.entryFee}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Location</h3>
                {challenge.location ? (
                  <div className="space-y-3 text-gray-700">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-blue-600">📍</span>
                        <span className="font-medium text-blue-900">Location Name</span>
                      </div>
                      <p className="text-blue-800">{challenge.location.locationName}</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-green-600">🎯</span>
                        <span className="font-medium text-green-900">Coordinates</span>
                      </div>
                      <p className="text-green-800 font-mono text-sm">
                        Lat: {challenge.location.latitude.toFixed(6)}<br/>
                        Lng: {challenge.location.longitude.toFixed(6)}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-purple-600">📏</span>
                        <span className="font-medium text-purple-900">Tolerance Radius</span>
                      </div>
                      <p className="text-purple-800">
                        You must be within <strong>{challenge.location.toleranceRadius}m</strong> of the specified location
                      </p>
                    </div>
                    
                    {challengeLocation && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-green-600">✅</span>
                          <span className="font-medium text-green-900">Location Verified</span>
                        </div>
                        <p className="text-green-800 text-sm">
                          Location data retrieved from challenge registration
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-yellow-600">⚠️</span>
                        <span className="font-medium text-yellow-900">Location Information Missing</span>
                      </div>
                      <p className="text-yellow-800 text-sm">
                        This challenge should have location requirements, but the information is not available.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-gray-600">ℹ️</span>
                        <span className="font-medium text-gray-900">Debug Information</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        Challenge ID: {challenge.id}<br/>
                        Has location property: {challenge.location ? 'Yes' : 'No'}<br/>
                        Location service response: {challengeLocation ? 'Success' : 'Failed'}<br/>
                        Available properties: {Object.keys(challenge).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Participants</h2>
                <button
                  onClick={handleViewParticipants}
                  className="text-amber-700 hover:text-amber-900 hover:underline"
                >
                  {showParticipants ? 'Hide' : 'View'} Participants ({challenge.participantsCount})
                </button>
              </div>

              {showParticipants && (
                <div className="bg-gray-50 rounded-lg p-4">
                  {participantsLoading ? (
                    <p className="text-gray-600">Loading participants...</p>
                  ) : participants.length === 0 ? (
                    <p className="text-gray-600">No participants yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {participants.map((participant, index) => {
                        const profileSrc = participant.profilePhotoUrl
                          ? participant.profilePhotoUrl
                          : participant.avatarId === 'FEMALE'
                            ? femaleAvatar
                            : participant.avatarId === 'MALE'
                              ? maleAvatar
                              : null

                        return (
                          <div
                            key={participant.id || index}
                            className="bg-white p-3 rounded-lg flex items-center space-x-3"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {profileSrc ? (
                                <img
                                  src={profileSrc}
                                  alt={participant.name || `${participant.firstName || ''} ${participant.lastName || ''}`.trim()}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600">
                                    {participant.name
                                      ? participant.name.charAt(0)
                                      : participant.firstName
                                      ? participant.firstName.charAt(0)
                                      : 'U'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {participant.name || `${participant.firstName || ''} ${participant.lastName || ''}`.trim()}
                              </p>
                              {participant.joinedAt && (
                                <p className="text-xs text-gray-500">
                                  Joined: {new Date(participant.joinedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Join Button */}
            <div className="text-center">
              <button
                onClick={handleJoinChallenge}
                className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
              >
                Join Challenge
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChallengeDetailPage 