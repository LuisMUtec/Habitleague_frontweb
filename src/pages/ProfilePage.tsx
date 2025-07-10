// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate }      from 'react-router-dom'
import Header               from '../components/layout/Header'
import { useAuth }          from '../context/AuthContext'
import { challengeService } from '../services/challengeService'
import { achievementService, type UserAchievement } from '../services/achievementService'
import maleAvatar           from '../assets/MALE.png'
import femaleAvatar         from '../assets/FEMALE.png'

type Tab = 'ongoing' | 'completed'

interface Challenge {
  id: number
  name: string
  description: string
  status: 'ONGOING' | 'COMPLETED' | string
  imageUrl?: string
  durationDays?: number
  participantsCount?: number
}

const ProfilePage: React.FC = () => {
  const { state: { user }, logout } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab]                   = useState<Tab>('ongoing')
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([])
  const [myAchievements, setMyAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading]           = useState(false)
  const [achievementsLoading, setAchievementsLoading] = useState(false)
  const [error, setError]               = useState<string|null>(null)
  const [achievementsError, setAchievementsError] = useState<string|null>(null)

  // Al montar, traigo mis retos
  useEffect(() => {
    setLoading(true)
    setError(null)

    challengeService.getMyChallenges()
      .then((response: any) => setMyChallenges(response.data || response))
      .catch((err: any) => setError(err.message || 'Error loading your challenges'))
      .finally(() => setLoading(false))
  }, [])

  // Al montar, traigo mis logros
  useEffect(() => {
    setAchievementsLoading(true)
    setAchievementsError(null)

    console.log('🔄 Loading achievements...')
    achievementService.getMyAchievements()
      .then((response: any) => {
        console.log('✅ Achievements loaded:', response)
        // El backend puede devolver directamente el array o dentro de un objeto data
        const achievements = Array.isArray(response) ? response : (response.data || response)
        setMyAchievements(achievements || [])
      })
      .catch((err: any) => {
        console.error('❌ Error loading achievements:', err)
        setAchievementsError(err.message || 'Error loading your achievements')
      })
      .finally(() => setAchievementsLoading(false))
  }, [])

  // Filtrar según pestaña
  const ongoing   = myChallenges.filter(c => c.status !== 'COMPLETED')
  const completed = myChallenges.filter(c => c.status === 'COMPLETED')

  // Fuente de la imagen de perfil
  const profileSrc = user?.profilePhotoUrl
    ? user.profilePhotoUrl
    : user?.avatarId === 'FEMALE'
      ? femaleAvatar
      : maleAvatar

  // Handlers
  const handleEdit   = () => navigate('/profile/edit')
  const handleLogout = () => { logout(); navigate('/login') }

  // Nombre de usuario de handle (antes de la @)
  const handleName = user?.email?.split('@')[0] ?? ''

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      <Header active="profile" />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* ─── Cabecera de perfil ─── */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src={profileSrc}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover shadow"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-500">@{handleName}</p>

          <div className="w-full sm:w-80 space-y-3">
            <button
              onClick={handleEdit}
              className="w-full h-12 bg-gray-200 rounded-xl text-gray-800 font-medium"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full h-12 bg-black rounded-xl text-white font-medium"
            >
              Log Out
            </button>
          </div>

          {/* ↓ Mostrar la bio justo debajo */}
          {user?.bio && (
            <p className="mt-4 text-gray-700 italic text-center">
              {user?.bio}
            </p>
          )}
        </div>

        {/* ─── My Challenges ─── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">My Challenges</h2>

          {/* Pestañas */}
          <div className="flex space-x-8 border-b">
            {(['Ongoing','Completed'] as const).map(label => {
              const key = label.toLowerCase() as Tab
              return (
                <button
                  key={label}
                  onClick={() => setTab(key)}
                  className={`
                    pb-2 font-medium ${
                      tab === key
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-500'
                    }
                  `}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Contenido */}
          {loading ? (
            <p className="text-gray-600">Loading…</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              { (tab==='ongoing' ? ongoing : completed).length === 0 ? (
                <p className="text-gray-500">
                  No {tab} challenges yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {(tab==='ongoing' ? ongoing : completed).map(ch => (
                    <div
                      key={ch.id}
                      className="flex justify-between items-center bg-white p-6 rounded-2xl shadow"
                    >
                      {/* Aquí podrías renderizar tu <ChallengeCard /> o contenido */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ch.name}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {ch.description}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {ch.durationDays ?? '-'} days
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* ─── Achievements ─── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
            <button
              onClick={() => {
                setAchievementsLoading(true)
                setAchievementsError(null)
                achievementService.getMyAchievements()
                  .then((response: any) => {
                    console.log('✅ Achievements refreshed:', response)
                    const achievements = Array.isArray(response) ? response : (response.data || response)
                    setMyAchievements(achievements || [])
                  })
                  .catch((err: any) => {
                    console.error('❌ Error refreshing achievements:', err)
                    setAchievementsError(err.message || 'Error loading your achievements')
                  })
                  .finally(() => setAchievementsLoading(false))
              }}
              disabled={achievementsLoading}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{achievementsLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          
          {achievementsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-600">Loading achievements…</p>
              </div>
            </div>
          ) : achievementsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{achievementsError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <p className="text-blue-800">
                    <strong>Debug:</strong> {myAchievements.length} achievements loaded
                  </p>
                </div>
              )}
              
              {/* Achievements disponibles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myAchievements.length > 0 ? (
                  myAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl shadow flex items-center space-x-3 ${
                        achievement.isUnlocked 
                          ? 'bg-white border-2 border-green-200' 
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        achievement.isUnlocked 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {achievement.isUnlocked ? (
                          <span className="text-xl">🏆</span>
                        ) : (
                          <span className="text-xl">🔒</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm ${
                          achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-xs ${
                          achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.isUnlocked && achievement.points && (
                          <p className="text-green-600 text-xs font-medium">
                            +{achievement.points} points
                          </p>
                        )}
                        {achievement.isUnlocked && achievement.unlockedAt && (
                          <p className="text-green-600 text-xs">
                            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                        {achievement.category && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                            {achievement.category}
                          </span>
                        )}
                        {!achievement.isUnlocked && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {achievement.progress}/{achievement.maxProgress || 1}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Mostrar achievements por defecto cuando no hay datos del backend
                  [
                    {
                      id: 1,
                      name: "Primer reto completado",
                      description: "Completa tu primer challenge",
                      isUnlocked: false,
                      progress: 0,
                      maxProgress: 1
                    },
                    {
                      id: 2,
                      name: "Racha de 7 días",
                      description: "Mantén una racha de 7 días consecutivos",
                      isUnlocked: false,
                      progress: 0,
                      maxProgress: 7
                    },
                    {
                      id: 3,
                      name: "Sin excusas",
                      description: "Completa un challenge sin faltar ningún día",
                      isUnlocked: false,
                      progress: 0,
                      maxProgress: 1
                    },
                    {
                      id: 4,
                      name: "Primer pago de penalización",
                      description: "Realiza tu primer pago por incumplimiento",
                      isUnlocked: false,
                      progress: 0,
                      maxProgress: 1
                    }
                  ].map(achievement => (
                    <div
                      key={achievement.id}
                      className="bg-gray-50 border-2 border-gray-200 p-4 rounded-xl shadow flex items-center space-x-3"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-200 text-gray-400 flex items-center justify-center">
                        <span className="text-xl">🔒</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-500 text-sm">
                          {achievement.name}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {achievement.description}
                        </p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {achievement.progress}/{achievement.maxProgress}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {myAchievements.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-white rounded-2xl shadow p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
                    <p className="text-gray-600 mb-4">
                      Complete challenges to unlock achievements and track your progress!
                    </p>
                    <button
                      onClick={() => navigate('/challenges')}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                    >
                      Browse Challenges
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default ProfilePage
