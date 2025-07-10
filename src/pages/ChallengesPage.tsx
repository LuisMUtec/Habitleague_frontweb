// src/pages/ChallengesPage.tsx
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/layout/Header'
import { apiService } from '../services/api'
import { buildApiUrl } from '../config/api'
import MapComponent from '../components/location/MapComponent'
import { locationService } from '../services/locationService'
import { challengeService } from '../services/challengeService'
import type { Challenge, ChallengeParticipant, Location } from '../types'
import { ChallengeCategory } from '../types'
import { getChallengePalette } from '../utils/colorPalette';

// importa tus imágenes desde assets
import mindfulnessImg from '../assets/mind.jpg'
import fitnessImg     from '../assets/fit.jpg'
import productivityImg from '../assets/productive.jpg'
import lifestyleImg   from '../assets/livestyle.jpg'
import healthImg      from '../assets/health.jpg'
import codingImg      from '../assets/coding.jpg'
import readingImg     from '../assets/reading.jpg'
import financeImg     from '../assets/finance.jpg'
import learningImg    from '../assets/learning.jpg'
import writingImg     from '../assets/writing.jpg'
import creativityImg  from '../assets/creativity.jpg'
import maleAvatar     from '../assets/MALE.png'
import femaleAvatar   from '../assets/FEMALE.png'

const categories = [
  { key: ChallengeCategory.MINDFULNESS,  label: 'Mindfulness',  img: mindfulnessImg },
  { key: ChallengeCategory.FITNESS,       label: 'Fitness',      img: fitnessImg     },
  { key: ChallengeCategory.PRODUCTIVITY,  label: 'Productivity', img: productivityImg},
  { key: ChallengeCategory.LIFESTYLE,     label: 'Lifestyle',    img: lifestyleImg  },
  { key: ChallengeCategory.HEALTH,        label: 'Health',       img: healthImg     },
  { key: ChallengeCategory.CODING,        label: 'Coding',       img: codingImg     },
  { key: ChallengeCategory.READING,       label: 'Reading',      img: readingImg    },
  { key: ChallengeCategory.FINANCE,       label: 'Finance',      img: financeImg    },
  { key: ChallengeCategory.LEARNING,      label: 'Learning',     img: learningImg   },
  { key: ChallengeCategory.WRITING,       label: 'Writing',      img: writingImg    },
  { key: ChallengeCategory.CREATIVITY,    label: 'Creativity',   img: creativityImg },
]

const ChallengesPage: React.FC = () => {
  const routerLocation = useLocation()
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [challenges, setChallenges]   = useState<Challenge[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  // Manejar categoría seleccionada desde el estado de navegación
  useEffect(() => {
    if (routerLocation.state?.selectedCategory) {
      setSelectedCat(routerLocation.state.selectedCategory)
      // Limpiar el estado para evitar que se mantenga en navegaciones posteriores
      window.history.replaceState({}, document.title)
    }
  }, [routerLocation.state])

  // Manejar challenge para unirse desde la página de detalle
  useEffect(() => {
    if (routerLocation.state?.joinChallengeId && routerLocation.state?.joinChallenge) {
      handleJoinChallenge(routerLocation.state.joinChallenge)
      // Limpiar el estado para evitar que se mantenga en navegaciones posteriores
      window.history.replaceState({}, document.title)
    }
  }, [routerLocation.state])

  // para el formulario de creación
  const [showForm, setShowForm]       = useState(false)
  const [name, setName]               = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory]       = useState<ChallengeCategory>(ChallengeCategory.MINDFULNESS)
  const [imageUrl, setImageUrl]       = useState('')
  const [rules, setRules]             = useState('')
  const [entryFee, setEntryFee]       = useState<number>(25)
  const [duration, setDuration]       = useState<number>(21)
  const [startDate, setStartDate]     = useState<string>('')
  const [endDate, setEndDate]         = useState<string>('')
  const [location, setLocation]       = useState<string>('')
  const [latitude, setLatitude]       = useState<string>('')
  const [longitude, setLongitude]     = useState<string>('')
  const [toleranceRadius, setToleranceRadius] = useState<string>('50.0')
  const [currency, setCurrency]       = useState<string>('USD')
  const [paymentMethodId, setPaymentMethodId] = useState<string>('')
  const [cardLast4, setCardLast4]     = useState<string>('')
  const [cardBrand, setCardBrand]     = useState<string>('')
  const [formError, setFormError]     = useState<string|null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Para el modal de unirse al challenge
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [joinFormData, setJoinFormData] = useState({
    currency: 'USD',
    paymentMethodId: '',
    cardLast4: '',
    cardBrand: ''
  })
  const [joinFormError, setJoinFormError] = useState<string|null>(null)
  const [joinFormLoading, setJoinFormLoading] = useState(false)

  // Para el modal de participantes
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [selectedChallengeForParticipants, setSelectedChallengeForParticipants] = useState<Challenge | null>(null)
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([])
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [participantsError, setParticipantsError] = useState<string|null>(null)

  // Para el modal de detalles del challenge
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedChallengeForDetails, setSelectedChallengeForDetails] = useState<Challenge | null>(null)

  // Para los challenges populares
  const [popularChallenges, setPopularChallenges] = useState<Challenge[]>([])
  const [popularLoading, setPopularLoading] = useState(false)
  const [popularError, setPopularError] = useState<string|null>(null)

  // fetch challenges populares al montar el componente
  useEffect(() => {
    const fetchPopularChallenges = async () => {
      setPopularLoading(true)
      setPopularError(null)
      try {
        const url = buildApiUrl('/challenges/popular?limit=5')
        const data = await apiService.getJSON<Challenge[]>(url)
        console.log('🔥 Popular challenges fetched from API:', data)
        if (data && data.length > 0) {
          console.log('🔥 First popular challenge sample:', {
            id: data[0].id,
            name: data[0].name,
            startDate: data[0].startDate,
            endDate: data[0].endDate,
            startDateType: typeof data[0].startDate,
            endDateType: typeof data[0].endDate,
            location: data[0].location
          })
        }
        setPopularChallenges(data)
      } catch (err: any) {
        setPopularError(err.message || 'Error loading popular challenges')
      } finally {
        setPopularLoading(false)
      }
    }

    fetchPopularChallenges()
  }, [])

  // fetch retos por categoría
  useEffect(() => {
    if (!selectedCat) return

    const fetchByCategory = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = buildApiUrl(`/challenges/category/${selectedCat}`)
        const data = await apiService.getJSON<Challenge[]>(url)
        console.log('📋 Challenges fetched from API:', data)
        if (data && data.length > 0) {
          console.log('📋 First challenge sample:', {
            id: data[0].id,
            name: data[0].name,
            startDate: data[0].startDate,
            endDate: data[0].endDate,
            startDateType: typeof data[0].startDate,
            endDateType: typeof data[0].endDate,
            location: data[0].location
          })
        }
        setChallenges(data)
      } catch (err: any) {
        setError(err.message || 'Error loading challenges')
      } finally {
        setLoading(false)
      }
    }

    fetchByCategory()
  }, [selectedCat])

  // Calcular duración automáticamente cuando cambien las fechas
  useEffect(() => {
    if (startDate && endDate) {
      const startDateObj = new Date(startDate)
      const endDateObj = new Date(endDate)
      const daysDiff = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff > 0) {
        setDuration(daysDiff)
      }
    }
  }, [startDate, endDate])

  const handleViewParticipants = async (challenge: Challenge) => {
    setSelectedChallengeForParticipants(challenge)
    setShowParticipantsModal(true)
    setParticipantsLoading(true)
    setParticipantsError(null)

    try {
      const url = buildApiUrl(`/challenges/${challenge.id}/participants`)
      const data = await apiService.getJSON<ChallengeParticipant[]>(url)
      setParticipants(data)
    } catch (err: any) {
      setParticipantsError(err.message || 'Error loading participants')
    } finally {
      setParticipantsLoading(false)
    }
  }

  const handleViewChallengeDetails = async (challenge: Challenge) => {
    console.log('🔍 Viewing challenge details:', challenge)
    console.log('📍 Challenge location:', challenge.location)
    console.log('📅 Challenge dates:', { 
      startDate: challenge.startDate, 
      endDate: challenge.endDate,
      startDateType: typeof challenge.startDate,
      endDateType: typeof challenge.endDate,
      startDateValid: challenge.startDate && challenge.startDate.trim() !== '' && !isNaN(new Date(challenge.startDate).getTime()),
      endDateValid: challenge.endDate && challenge.endDate.trim() !== '' && !isNaN(new Date(challenge.endDate).getTime())
    })
    
    // Fetch complete challenge data from individual endpoint
    let completeChallenge = { ...challenge }
    
    try {
      console.log('🔍 Fetching complete challenge data for ID:', challenge.id)
      const challengeResponse = await challengeService.getChallengeById(challenge.id)
      const challengeData = (challengeResponse as any).data || challengeResponse
      console.log('🔍 Complete challenge data from backend:', challengeData)
      
      // Update the challenge with complete data
      completeChallenge = { ...challenge, ...challengeData }
      console.log('✅ Complete challenge data loaded:', completeChallenge)
    } catch (err: any) {
      console.log('⚠️ Could not fetch complete challenge data:', err.message)
      // Continue with original challenge data
    }
    
    // Fetch location data for the challenge
    try {
      console.log('🔍 Fetching location for challenge ID:', challenge.id)
      const locationResponse = await locationService.getLocationByChallenge(challenge.id)
      console.log('📍 Location data from service:', locationResponse)
      console.log('📍 Location response type:', typeof locationResponse)
      console.log('📍 Location response keys:', locationResponse ? Object.keys(locationResponse) : 'null/undefined')
      
      if (locationResponse && typeof locationResponse === 'object' && 'latitude' in locationResponse) {
        completeChallenge.location = {
          latitude: (locationResponse as Location).latitude,
          longitude: (locationResponse as Location).longitude,
          locationName: (locationResponse as Location).locationName,
          toleranceRadius: (locationResponse as Location).toleranceRadius
        }
        console.log('✅ Location found and added to challenge:', completeChallenge.location)
      } else {
        console.log('❌ Location response does not have expected structure')
        console.log('❌ Response content:', JSON.stringify(locationResponse, null, 2))
      }
    } catch (err: any) {
      console.log('⚠️ Could not fetch challenge location:', err.message)
      console.log('⚠️ Error details:', err)
      console.log('⚠️ Error stack:', err.stack)
      
      // Try to get more details about the error
      if (err.response) {
        console.log('⚠️ Error response status:', err.response.status)
        console.log('⚠️ Error response data:', err.response.data)
      }
      
      // Continue without location data
    }
    
    console.log('🎯 Final challenge data for modal:', completeChallenge)
    console.log('🎯 Final dates check:', {
      startDate: completeChallenge.startDate,
      endDate: completeChallenge.endDate,
      startDateValid: completeChallenge.startDate && completeChallenge.startDate.trim() !== '' && !isNaN(new Date(completeChallenge.startDate).getTime()),
      endDateValid: completeChallenge.endDate && completeChallenge.endDate.trim() !== '' && !isNaN(new Date(completeChallenge.endDate).getTime())
    })
    setSelectedChallengeForDetails(completeChallenge)
    setShowDetailsModal(true)
  }

  const handleJoinChallenge = async (challenge: Challenge) => {
    console.log('🔗 Joining challenge:', challenge)
    
    // Si no tenemos los datos de ubicación, obtenerlos antes de mostrar el modal
    if (!challenge.location) {
      console.log('📍 No location data available, fetching before showing join modal...');
      try {
        const locationResponse = await locationService.getLocationByChallenge(challenge.id);
        console.log('📍 Location data for join modal:', locationResponse);
        
        if (locationResponse && typeof locationResponse === 'object' && 'latitude' in locationResponse) {
          const challengeWithLocation = {
            ...challenge,
            location: {
              latitude: (locationResponse as Location).latitude,
              longitude: (locationResponse as Location).longitude,
              locationName: (locationResponse as Location).locationName,
              toleranceRadius: (locationResponse as Location).toleranceRadius
            }
          };
          console.log('✅ Challenge with location data:', challengeWithLocation);
          setSelectedChallenge(challengeWithLocation);
        } else {
          console.error('❌ Invalid location data structure');
          setSelectedChallenge(challenge);
        }
      } catch (locationError: any) {
        console.error('❌ Error fetching location data for join modal:', locationError);
        setSelectedChallenge(challenge);
      }
    } else {
      setSelectedChallenge(challenge);
    }
    
    setJoinFormData({
      currency: 'USD',
      paymentMethodId: '',
      cardLast4: '',
      cardBrand: ''
    })
    setJoinFormError(null)
    setShowJoinModal(true)
  }

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChallenge) return

    setJoinFormError(null)

    // Validaciones
    if (!joinFormData.paymentMethodId.trim()) {
      setJoinFormError('Payment method ID is required')
      return
    }
    if (!joinFormData.cardLast4.trim() || joinFormData.cardLast4.length !== 4) {
      setJoinFormError('Please enter the last 4 digits of your card')
      return
    }
    if (!joinFormData.cardBrand.trim()) {
      setJoinFormError('Please select a card brand')
      return
    }
    if (!joinFormData.currency.trim()) {
      setJoinFormError('Currency is required')
      return
    }

    setJoinFormLoading(true)
    try {
      // Obtener los datos de ubicación reales del challenge
      let locationData = selectedChallenge.location;
      
      // Si no tenemos los datos de ubicación, obtenerlos del backend
      if (!locationData) {
        console.log('📍 No location data available, fetching from backend...');
        try {
          const locationResponse = await locationService.getLocationByChallenge(selectedChallenge.id);
          console.log('📍 Location data from backend:', locationResponse);
          
          if (locationResponse && typeof locationResponse === 'object' && 'latitude' in locationResponse) {
            locationData = {
              latitude: (locationResponse as Location).latitude,
              longitude: (locationResponse as Location).longitude,
              locationName: (locationResponse as Location).locationName,
              toleranceRadius: (locationResponse as Location).toleranceRadius
            };
            console.log('✅ Real location data obtained:', locationData);
          } else {
            throw new Error('Invalid location data structure from backend');
          }
        } catch (locationError: any) {
          console.error('❌ Error fetching location data:', locationError);
          setJoinFormError(`Error: Could not get challenge location data. Please try again.`);
          setJoinFormLoading(false);
          return;
        }
      } else {
        console.log('✅ Using existing location data:', locationData);
      }

      // Crear payload con la estructura exacta esperada por el backend
      const payload = {
        payment: {
          challengeId: selectedChallenge.id,
          amount: selectedChallenge.entryFee,
          currency: joinFormData.currency.trim(),
          paymentMethodId: joinFormData.paymentMethodId.trim(),
          cardLast4: joinFormData.cardLast4.trim(),
          cardBrand: joinFormData.cardBrand.trim()
        },
        location: {
          challengeId: selectedChallenge.id,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          locationName: locationData.locationName,
          toleranceRadius: locationData.toleranceRadius
        }
      }

      const url = buildApiUrl(`/challenges/${selectedChallenge.id}/join`)
      console.log('Sending join payload to backend:', JSON.stringify(payload, null, 2))
      await apiService.postText(url, payload)

      // Mostrar mensaje de éxito
      alert('Successfully joined the challenge!')

      // Cerrar modal y limpiar
      setShowJoinModal(false)
      setSelectedChallenge(null)
      setJoinFormData({
        currency: 'USD',
        paymentMethodId: '',
        cardLast4: '',
        cardBrand: ''
      })

      // Refrescar la lista de challenges
      if (selectedCat) {
        const updated = await apiService.getJSON<Challenge[]>(
          buildApiUrl(`/challenges/category/${selectedCat}`)
        )
        setChallenges(updated)
      }
    } catch (err: any) {
      setJoinFormError(err.message || 'Error joining challenge')
    } finally {
      setJoinFormLoading(false)
    }
  }

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    console.log('📍 Location selected from map:', { lat, lng, address })
    setLatitude(lat.toString())
    setLongitude(lng.toString())
    setLocation(address)
    console.log('📍 State updated:', { latitude: lat.toString(), longitude: lng.toString(), location: address })
  }

  // Función de debug para verificar el estado actual
  const debugCurrentState = () => {
    console.log('🔍 DEBUG: Current form state:', {
      name,
      description,
      category,
      imageUrl,
      rules,
      entryFee,
      duration,
      startDate,
      endDate,
      location,
      latitude,
      longitude,
      toleranceRadius,
      currency,
      paymentMethodId,
      cardLast4,
      cardBrand
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // validaciones básicas
    if (!name.trim()) {
      setFormError('Challenge name is required')
      return
    }
    if (!description.trim()) {
      setFormError('Description is required')
      return
    }
    if (!imageUrl.trim()) {
      setFormError('Image URL is required')
      return
    }
    if (!startDate) {
      setFormError('Start date is required')
      return
    }
    if (!endDate) {
      setFormError('End date is required')
      return
    }
    
    // Validar que la fecha de inicio sea futura
    const startDateObj = new Date(startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (startDateObj <= today) {
      setFormError('Start date must be in the future')
      return
    }
    
    // Validar que la fecha de fin sea después de la de inicio
    const endDateObj = new Date(endDate)
    if (endDateObj <= startDateObj) {
      setFormError('End date must be after start date')
      return
    }
    
    // Validar que la duración coincida con las fechas
    const daysDiff = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff !== duration) {
      setFormError(`Duration must match the date range (${daysDiff} days)`)
      return
    }
    if (!location.trim()) {
      setFormError('Location name is required')
      return
    }
    if (!latitude.trim()) {
      setFormError('Latitude is required')
      return
    }
    if (!longitude.trim()) {
      setFormError('Longitude is required')
      return
    }
    if (!toleranceRadius.trim()) {
      setFormError('Tolerance radius is required')
      return
    }
    
    // Validar que latitude y longitude sean números válidos
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    const radius = parseFloat(toleranceRadius)
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setFormError('Latitude must be a valid number between -90 and 90')
      return
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setFormError('Longitude must be a valid number between -180 and 180')
      return
    }
    if (isNaN(radius) || radius <= 0) {
      setFormError('Tolerance radius must be a positive number')
      return
    }
    if (!rules.trim()) {
      setFormError('Rules are required')
      return
    }
    if (duration < 21 || duration > 30) {
      setFormError('Duration must be between 21 and 30 days')
      return
    }
    if (entryFee <= 0) {
      setFormError('Entry fee must be greater than 0')
      return
    }
    if (!paymentMethodId.trim()) {
      setFormError('Payment method ID is required')
      return
    }
    if (!cardLast4.trim() || cardLast4.length !== 4) {
      setFormError('Please enter the last 4 digits of your card')
      return
    }
    if (!cardBrand.trim()) {
      setFormError('Please select a card brand')
      return
    }
    if (!currency.trim()) {
      setFormError('Currency is required')
      return
    }

    setFormLoading(true)
    try {
      console.log('📍 Current location state before creating challenge:', {
        location: location,
        latitude: latitude,
        longitude: longitude,
        toleranceRadius: toleranceRadius,
        toleranceRadiusType: typeof toleranceRadius,
        toleranceRadiusParsed: parseFloat(toleranceRadius)
      })
      
      // Crear objeto de ubicación con los datos ingresados por el usuario
      const locationData = {
        challengeId: null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        locationName: location.trim(),
        toleranceRadius: parseFloat(toleranceRadius)
      }
      
      console.log('📍 Location data object:', locationData)
      console.log('📍 Location data validation:', {
        latitudeValid: !isNaN(locationData.latitude),
        longitudeValid: !isNaN(locationData.longitude),
        toleranceRadiusValid: !isNaN(locationData.toleranceRadius),
        locationNameValid: locationData.locationName.length > 0
      })

      // Crear objeto de pago con la estructura exacta esperada
      const paymentData = {
        challengeId: null,
        amount: parseFloat(entryFee.toFixed(2)),
        currency: currency.trim(),
        paymentMethodId: paymentMethodId.trim(),
        cardLast4: cardLast4.trim(),
        cardBrand: cardBrand.trim()
      }

      // Crear payload con la estructura exacta esperada por el backend
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        imageUrl: imageUrl.trim(),
        rules: rules.trim(),
        durationDays: duration,
        entryFee: parseFloat(entryFee.toFixed(2)),
        startDate,
        endDate,
        payment: paymentData,
        location: locationData
      }

      const url = buildApiUrl('/challenges')
      console.log('Sending payload to backend:', JSON.stringify(payload, null, 2))
      const response = await apiService.postText(url, payload)
      console.log('✅ Challenge creation response:', response)
      
      // Try to parse response if it's JSON
      try {
        const responseData = JSON.parse(response)
        console.log('✅ Parsed response data:', responseData)
      } catch (e) {
        console.log('⚠️ Response is not JSON, raw response:', response)
      }

      // refresca la lista si corresponde
      if (selectedCat === category) {
        console.log('🔄 Refreshing challenges list for category:', category)
        const updated = await apiService.getJSON<Challenge[]>(
          buildApiUrl(`/challenges/category/${category}`)
        )
        console.log('🔄 Updated challenges list:', updated)
        if (updated && updated.length > 0) {
          console.log('🔄 Latest challenge in updated list:', {
            id: updated[updated.length - 1].id,
            name: updated[updated.length - 1].name,
            startDate: updated[updated.length - 1].startDate,
            endDate: updated[updated.length - 1].endDate,
            location: updated[updated.length - 1].location
          })
        }
        setChallenges(updated)
      }

      // Mostrar mensaje de éxito
      alert('Challenge created successfully!')

      // limpia y cierra form
      setName('')
      setDescription('')
      setCategory(ChallengeCategory.MINDFULNESS)
      setImageUrl('')
      setRules('')
      setEntryFee(25)
      setDuration(21)
      setStartDate('')
      setEndDate('')
      setLocation('')
      setLatitude('')
      setLongitude('')
      setToleranceRadius('50.0')
      setCurrency('USD')
      setPaymentMethodId('')
      setCardLast4('')
      setCardBrand('')
      setShowForm(false)
    } catch (err: any) {
      setFormError(err.message || 'Error creating challenge')
    } finally {
      setFormLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      <Header active="challenges" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* ─── Popular Challenges ─── */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Popular Challenges</h2>
          
          {popularLoading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-600">Loading popular challenges...</p>
            </div>
          )}
          
          {popularError && (
            <div className="text-center py-8">
              <p className="text-red-600">{popularError}</p>
            </div>
          )}
          
          {!popularLoading && !popularError && popularChallenges.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No popular challenges available.</p>
            </div>
          )}
          
          {!popularLoading && !popularError && popularChallenges.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {popularChallenges.map(ch => (
                <div
                  key={ch.id}
                  className="bg-white rounded-2xl shadow p-4 flex flex-col"
                >
                  <img
                    src={ch.imageUrl}
                    alt={ch.name}
                    className="h-32 w-full object-cover rounded-lg mb-3"
                  />
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {ch.name}
                  </h4>
                  <p className="text-gray-700 text-xs flex-1 line-clamp-2 mb-3">
                    {ch.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>{ch.durationDays} days</span>
                    <button
                      onClick={() => handleViewParticipants(ch)}
                      className="text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
                    >
                      {ch.participantsCount}{' '}
                      {ch.participantsCount === 1 ? 'participant' : 'participants'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleViewChallengeDetails(ch)}
                      className="w-full py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleJoinChallenge(ch)}
                      className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900"
                    >
                      Join Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── Categorías ─── */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
          <div className="flex flex-col space-y-4 max-h-80 overflow-y-auto pr-2">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCat(cat.key)}
                className={
                  `flex items-center space-x-4 p-3 bg-white rounded-lg shadow ${selectedCat === cat.key ? 'ring-2 ring-black' : ''}`
                }
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                />
                <span className="text-gray-700 font-medium">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-900"
            >
              Create a Challenge
            </button>
          </div>
        </section>

        {/* ─── Formulario de creación ─── */}
        {showForm && (
          <section className="bg-white p-6 rounded-2xl shadow space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Create your own</h3>
              <button
                type="button"
                onClick={debugCurrentState}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                🔍 Debug State
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Challenge Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="“My Challenge”"
                  className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Write a short description"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ChallengeCategory)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  {Object.values(ChallengeCategory).map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entry Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entry Fee ($)
                </label>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  value={entryFee}
                  onChange={e => setEntryFee(Number(e.target.value))}
                  className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days, calculated automatically)
                </label>
                <input
                  type="number"
                  min={21}
                  max={30}
                  value={duration}
                  readOnly
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Rules */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rules
                </label>
                <textarea
                  rows={4}
                  value={rules}
                  onChange={e => setRules(e.target.value)}
                  placeholder="Write the rules for this challenge"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Start / End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Location Details</h4>
                
                {/* Map Component */}
                <MapComponent
                  onLocationSelect={handleLocationSelect}
                  height="300px"
                />

                {/* Location Name (read-only, filled by map) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Select location on map above"
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                {/* Latitude (read-only, filled by map) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    placeholder="Select location on map above"
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                {/* Longitude (read-only, filled by map) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    placeholder="Select location on map above"
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                {/* Tolerance Radius */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tolerance Radius (meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={toleranceRadius}
                    onChange={e => setToleranceRadius(e.target.value)}
                    placeholder="50.0"
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Payment Details</h4>
                
                {/* Amount and Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (from Entry Fee)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={entryFee}
                      onChange={e => setEntryFee(Number(e.target.value))}
                      className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="MXN">MXN</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>

                {/* Payment Method Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method ID
                    </label>
                    <input
                      type="text"
                      value={paymentMethodId}
                      onChange={e => setPaymentMethodId(e.target.value)}
                      placeholder="pm_1234567890"
                      className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Last 4 Digits
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={cardLast4}
                      onChange={e => setCardLast4(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234"
                      className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Brand
                    </label>
                    <select
                      value={cardBrand}
                      onChange={e => setCardBrand(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <option value="">Select brand</option>
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="amex">American Express</option>
                      <option value="discover">Discover</option>
                    </select>
                  </div>
                </div>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <button
                type="submit"
                disabled={formLoading}
                className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-900 disabled:opacity-50"
              >
                Create Challenge
              </button>
            </form>
          </section>
        )}

        {/* ─── Resultados ─── */}
        {selectedCat && (
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {categories.find(c => c.key === selectedCat)?.label} Challenges
            </h3>

            {loading && <p className="text-gray-600">Loading…</p>}
            {error   && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.length > 0
                  ? challenges.map(ch => {
                      return (
                        <div
                          key={ch.id}
                          className="rounded-2xl shadow p-6 flex flex-col bg-white"
                        >
                          <img
                            src={ch.imageUrl}
                            alt={ch.name}
                            className="h-40 w-full object-cover rounded-lg mb-4"
                          />
                          <h4 className="text-lg font-semibold mb-1 text-gray-900">
                            {ch.name}
                          </h4>
                          <p className="text-gray-600 mb-4 flex-grow">
                            {ch.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {ch.durationDays} days • ${ch.entryFee}
                            </span>
                            <button
                              onClick={() => handleJoinChallenge(ch)}
                              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
                            >
                              Join Challenge
                            </button>
                          </div>
                        </div>
                      );
                    })
                  : (
                    <p className="text-gray-600 col-span-full">
                      No challenges found in this category.
                    </p>
                  )}
              </div>
            )}
          </section>
        )}

        {/* ─── Modal para unirse al challenge ─── */}
        {showJoinModal && selectedChallenge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Join Challenge: {selectedChallenge.name}
                </h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Challenge Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Entry Fee:</strong> ${selectedChallenge.entryFee}</p>
                  <p><strong>Duration:</strong> {selectedChallenge.durationDays} days</p>
                  <p><strong>Category:</strong> {selectedChallenge.category}</p>
                  {selectedChallenge.location && (
                    <>
                      <p><strong>Location:</strong> {selectedChallenge.location.locationName}</p>
                      <p><strong>Coordinates:</strong> {selectedChallenge.location.latitude}, {selectedChallenge.location.longitude}</p>
                      <p><strong>Tolerance Radius:</strong> {selectedChallenge.location.toleranceRadius}m</p>
                    </>
                  )}
                </div>
              </div>

              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={joinFormData.currency}
                    onChange={e => setJoinFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="MXN">MXN</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method ID
                  </label>
                  <input
                    type="text"
                    value={joinFormData.paymentMethodId}
                    onChange={e => setJoinFormData(prev => ({ ...prev, paymentMethodId: e.target.value }))}
                    placeholder="pm_test_67890"
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Last 4 Digits
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={joinFormData.cardLast4}
                    onChange={e => setJoinFormData(prev => ({ ...prev, cardLast4: e.target.value.replace(/\D/g, '') }))}
                    placeholder="1234"
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Brand
                  </label>
                  <select
                    value={joinFormData.cardBrand}
                    onChange={e => setJoinFormData(prev => ({ ...prev, cardBrand: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="">Select brand</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                  </select>
                </div>

                {joinFormError && (
                  <p className="text-sm text-red-600">{joinFormError}</p>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 h-12 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joinFormLoading}
                    className="flex-1 h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-900 disabled:opacity-50"
                  >
                    {joinFormLoading ? 'Joining...' : 'Join Challenge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── Modal de detalles del challenge ─── */}
        {showDetailsModal && selectedChallengeForDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Challenge Details: {selectedChallengeForDetails.name}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Imagen del challenge */}
                <div>
                  <img
                    src={selectedChallengeForDetails.imageUrl}
                    alt={selectedChallengeForDetails.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Información del challenge */}
                <div className="space-y-6">
                  {/* Información básica */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Challenge Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedChallengeForDetails.name}</p>
                      <p><strong>Category:</strong> {selectedChallengeForDetails.category}</p>
                      <p><strong>Duration:</strong> {selectedChallengeForDetails.durationDays} days</p>
                      <p><strong>Entry Fee:</strong> ${selectedChallengeForDetails.entryFee}</p>
                      <p><strong>Participants:</strong> {selectedChallengeForDetails.participantsCount}</p>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-700 text-sm">{selectedChallengeForDetails.description}</p>
                  </div>

                  {/* Reglas */}
                  {selectedChallengeForDetails.rules && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Rules</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedChallengeForDetails.rules}</p>
                      </div>
                    </div>
                  )}

                  {/* Fechas */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Start Date:</strong> {
                        (() => {
                          const startDate = selectedChallengeForDetails.startDate;
                          if (!startDate || startDate.trim() === '') return 'Not specified';
                          
                          // Try different date parsing methods
                          let dateObj = new Date(startDate);
                          if (isNaN(dateObj.getTime())) {
                            // Try parsing as ISO string
                            dateObj = new Date(startDate + 'T00:00:00');
                          }
                          if (isNaN(dateObj.getTime())) {
                            // Try parsing as timestamp
                            const timestamp = parseInt(startDate);
                            if (!isNaN(timestamp)) {
                              dateObj = new Date(timestamp);
                            }
                          }
                          
                          return !isNaN(dateObj.getTime()) 
                            ? dateObj.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                weekday: 'long'
                              })
                            : `Raw value: ${startDate}`;
                        })()
                      }</p>
                      <p><strong>End Date:</strong> {
                        (() => {
                          const endDate = selectedChallengeForDetails.endDate;
                          if (!endDate || endDate.trim() === '') return 'Not specified';
                          
                          // Try different date parsing methods
                          let dateObj = new Date(endDate);
                          if (isNaN(dateObj.getTime())) {
                            // Try parsing as ISO string
                            dateObj = new Date(endDate + 'T00:00:00');
                          }
                          if (isNaN(dateObj.getTime())) {
                            // Try parsing as timestamp
                            const timestamp = parseInt(endDate);
                            if (!isNaN(timestamp)) {
                              dateObj = new Date(timestamp);
                            }
                          }
                          
                          return !isNaN(dateObj.getTime()) 
                            ? dateObj.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                weekday: 'long'
                              })
                            : `Raw value: ${endDate}`;
                        })()
                      }</p>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Location Requirements</h4>
                    {selectedChallengeForDetails.location && 
                     selectedChallengeForDetails.location.locationName && 
                     selectedChallengeForDetails.location.locationName.trim() !== '' ? (
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                        <p><strong>Location:</strong> {selectedChallengeForDetails.location.locationName}</p>
                        <p><strong>Coordinates:</strong> {
                          selectedChallengeForDetails.location.latitude && 
                          selectedChallengeForDetails.location.longitude
                            ? `${selectedChallengeForDetails.location.latitude.toFixed(6)}, ${selectedChallengeForDetails.location.longitude.toFixed(6)}`
                            : 'N/A'
                        }</p>
                        <p><strong>Tolerance Radius:</strong> {
                          selectedChallengeForDetails.location.toleranceRadius 
                            ? `${selectedChallengeForDetails.location.toleranceRadius}m`
                            : 'N/A'
                        }</p>
                        <p className="text-blue-600 text-xs">
                          💡 You must be within {selectedChallengeForDetails.location.toleranceRadius || 'specified'}m of this location to submit evidence
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-800 text-sm">
                          ⚠️ <strong>Warning:</strong> Could not load location data for this challenge.
                        </p>
                        <p className="text-red-700 text-xs mt-1">
                          This may be due to a backend error. Please try again later or contact support.
                        </p>
                        <p className="text-red-700 text-xs">
                          Challenge ID: {selectedChallengeForDetails.id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 h-12 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false)
                    handleJoinChallenge(selectedChallengeForDetails)
                  }}
                  className="flex-1 h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-900"
                >
                  Join Challenge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Modal de participantes ─── */}
        {showParticipantsModal && selectedChallengeForParticipants && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Participants: {selectedChallengeForParticipants.name}
                </h3>
                <button
                  onClick={() => {
                    setShowParticipantsModal(false)
                    setSelectedChallengeForParticipants(null)
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
                                         {participants.map((participant, index) => {
                       // Determinar la fuente de la imagen de perfil
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
                           className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3"
                         >
                           <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                             {profileSrc ? (
                               <img
                                 src={profileSrc}
                                 alt={participant.name || `${participant.firstName || ''} ${participant.lastName || ''}`.trim()}
                                 className="w-full h-full object-cover"
                               />
                             ) : (
                               <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                 <span className="text-sm font-medium text-gray-600">
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
                             <p className="text-xs text-gray-500 truncate">
                               {participant.email}
                             </p>
                             {participant.joinedAt && (
                               <p className="text-xs text-gray-400">
                                 Joined: {new Date(participant.joinedAt).toLocaleDateString()}
                               </p>
                             )}
                           </div>
                         </div>
                       )
                     })}
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

export default ChallengesPage