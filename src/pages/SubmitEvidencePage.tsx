import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { evidenceService } from '../services/evidenceService';
import { challengeService } from '../services/challengeService';
import type { Challenge, SubmitEvidenceRequest, DailySubmissionStatus } from '../types';

const SubmitEvidencePage: React.FC = () => {
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [dailyStatus, setDailyStatus] = useState<DailySubmissionStatus | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);

  useEffect(() => {
    // Si no hay challengeId, cargar challenges del usuario
    if (!challengeId) {
      loadMyChallenges();
      return;
    }
    
    loadChallengeData();
  }, [challengeId]);

  const loadMyChallenges = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading user challenges for evidence submission...');
      const response = await challengeService.getMyChallenges();
      const data = (response as any).data || response;
      
      // Normalizar los challenges
      const normalizedChallenges = Array.isArray(data) ? data.map(challenge => ({
        ...challenge,
        id: challenge.id || challenge.challengeId
      })) : [];
      
      console.log('✅ User challenges loaded:', normalizedChallenges);
      setMyChallenges(normalizedChallenges);
    } catch (err: any) {
      console.error('❌ Error loading user challenges:', err);
      setError(err.message || 'Error loading your challenges');
    } finally {
      setLoading(false);
    }
  };

  const loadChallengeData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading challenge data for evidence submission...');
      
      const challengeIdNum = parseInt(challengeId!);
      
      // Cargar challenge y estado diario en paralelo
      const [challengeData, statusData] = await Promise.all([
        challengeService.getChallengeById(challengeIdNum),
        evidenceService.getDailySubmissionStatus(challengeIdNum)
      ]);

      console.log('✅ Challenge data loaded:', { challenge: challengeData, status: statusData });
      
      setChallenge(challengeData as Challenge);
      setDailyStatus(statusData);

      // Si ya envió evidencia hoy, mostrar mensaje
      if (statusData.hasSubmittedToday) {
        setError('You have already submitted evidence for today. Come back tomorrow!');
      }
    } catch (err: any) {
      console.error('❌ Error loading challenge data:', err);
      setError(err.message || 'Error loading challenge data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('📸 File selected:', file.name);
      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = async () => {
    setLocationError(null);
    
    try {
      console.log('📍 Getting current location...');
      const currentLocation = await evidenceService.getCurrentLocation();
      setLocation(currentLocation);
      console.log('✅ Location obtained:', currentLocation);
    } catch (err: any) {
      console.error('❌ Error getting location:', err);
      setLocationError('Could not get your location. Please enable location services and try again.');
    }
  };

  const handleSubmit = async () => {
    const currentChallengeId = challengeId ? parseInt(challengeId) : selectedChallengeId;
    
    if (!currentChallengeId || !selectedFile || !location) {
      setError('Please select a challenge, an image, and get your location before submitting.');
      return;
    }

    if (!challenge) {
      setError('Challenge data not loaded. Please try again.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log('🔄 Submitting evidence...');
      
      // Validar ubicación usando la tolerancia del challenge
      const locationValidation = evidenceService.validateLocation(
        challenge,
        location.latitude,
        location.longitude
      );

      if (!locationValidation.isValid) {
        setError(
          `Location validation failed! You are ${locationValidation.distance.toFixed(0)}m away from the challenge location. ` +
          `The tolerance radius is ${locationValidation.toleranceRadius}m. ` +
          `Please move closer to ${challenge.location?.locationName || 'the challenge location'}.`
        );
        setSubmitting(false);
        return;
      }

      console.log('✅ Location validation passed:', locationValidation);
      
      // Subir imagen (simulado - cualquier imagen es aceptada)
      const imageUrl = await evidenceService.uploadEvidenceImage(selectedFile);
      
      // Preparar request
      const request: SubmitEvidenceRequest = {
        challengeId: currentChallengeId,
        imageUrl,
        description: description.trim() || undefined,
        latitude: location.latitude,
        longitude: location.longitude
      };

      console.log('📤 Submitting evidence request:', request);
      
      // Enviar evidencia
      const response = await evidenceService.submitEvidence(request);
      
      console.log('✅ Evidence submitted successfully:', response);
      
      // Mostrar resultado
      if (response.success) {
        alert(
          `Evidence submitted successfully! Status: ${response.status}\n\n` +
          `Location validation: ✅ Passed (${locationValidation.distance.toFixed(0)}m within ${locationValidation.toleranceRadius}m tolerance)\n` +
          `Image validation: ✅ Accepted (no AI validation required)\n\n` +
          `${response.message}`
        );
        navigate('/evidences');
      } else {
        setError(response.message || 'Failed to submit evidence');
      }
    } catch (err: any) {
      console.error('❌ Error submitting evidence:', err);
      setError(err.message || 'Error submitting evidence');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/evidences');
  };

  const handleChallengeSelect = async (challengeId: number) => {
    setSelectedChallengeId(challengeId);
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading data for selected challenge:', challengeId);
      
      // Cargar challenge y estado diario en paralelo
      const [challengeData, statusData] = await Promise.all([
        challengeService.getChallengeById(challengeId),
        evidenceService.getDailySubmissionStatus(challengeId)
      ]);

      console.log('✅ Challenge data loaded:', { challenge: challengeData, status: statusData });
      
      setChallenge(challengeData as Challenge);
      setDailyStatus(statusData);

      // Si ya envió evidencia hoy, mostrar mensaje
      if (statusData.hasSubmittedToday) {
        setError('You have already submitted evidence for today. Come back tomorrow!');
      }
    } catch (err: any) {
      console.error('❌ Error loading challenge data:', err);
      setError(err.message || 'Error loading challenge data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="evidences" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-600">Loading challenge data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Si no hay challengeId y no hay challenge seleccionado, mostrar selección de challenges
  if (!challengeId && !challenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="evidences" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Evidences</span>
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Daily Evidence</h1>
            <p className="text-gray-600">Select a challenge to submit evidence for</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Select a Challenge</h3>
            
            {myChallenges.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges joined</h3>
                <p className="text-gray-600 mb-6">
                  You need to join a challenge before you can submit evidence.
                </p>
                <button
                  onClick={() => navigate('/challenges')}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  Browse Challenges
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-black transition-colors cursor-pointer bg-[#F7F4F2]"
                    onClick={() => handleChallengeSelect(challenge.id!)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📸</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {challenge.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {challenge.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{challenge.durationDays} days</span>
                          <span>${challenge.entryFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="evidences" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Challenge not found</p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (dailyStatus?.hasSubmittedToday) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="evidences" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Already Submitted Today</h3>
              <p className="text-gray-600 mb-6">
                You have already submitted your daily evidence for this challenge. Come back tomorrow!
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleBack}
                  className="w-full px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  Go Back to Evidences
                </button>
                <button
                  onClick={() => navigate(`/challenges/${challengeId}`)}
                  className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  View Challenge
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EADA]">
      <Header active="evidences" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Evidences</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Daily Evidence</h1>
          <p className="text-gray-600">Challenge: {challenge.name}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Challenge Info */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.name}</h3>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>Duration: {challenge.durationDays} days</span>
              <span>Entry Fee: ${challenge.entryFee}</span>
            </div>
            
            {/* Location Requirements */}
            {challenge.location && (
              <div className="p-4 bg-[#CEC1A8] border border-[#B59E7D] rounded-lg">
                <h4 className="font-medium text-[#584738] mb-2">📍 Location Requirements</h4>
                <div className="space-y-2 text-sm text-[#584738]">
                  <p><strong>Required Location:</strong> {challenge.location.locationName}</p>
                  <p><strong>Coordinates:</strong> {challenge.location.latitude.toFixed(6)}, {challenge.location.longitude.toFixed(6)}</p>
                  <p><strong>Tolerance Radius:</strong> {challenge.location.toleranceRadius}m</p>
                  <p className="text-xs text-[#584738] mt-2">
                    💡 You must be within {challenge.location.toleranceRadius}m of this location to submit evidence
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Take a Photo</h3>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {!previewUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📸</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Take a photo showing your challenge activity
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                  >
                    Take Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Evidence preview"
                      className="w-full max-w-md mx-auto rounded-lg shadow"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Retake Photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Add Description (Optional)</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you did for the challenge today..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Verify Location</h3>
            <div className="space-y-4">
              {!location ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📍</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    We need to verify you're at your registered location
                  </p>
                  <button
                    onClick={handleGetLocation}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Get My Location
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-green-800 font-medium">Location verified</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                  </p>
                  <button
                    onClick={handleGetLocation}
                    className="mt-2 text-sm text-green-700 hover:text-green-800 underline"
                  >
                    Update location
                  </button>
                </div>
              )}
              
              {locationError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{locationError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || !location || submitting}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Evidence</span>
              )}
            </button>
            
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Important Reminders:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Submit evidence daily to avoid penalties</li>
              <li>• Take clear photos showing your challenge activity (any image is accepted)</li>
              <li>• Make sure you're at your registered location (within {challenge.location?.toleranceRadius || 'specified'}m tolerance)</li>
              <li>• Evidence submission window: 00:00 - 23:59 daily</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitEvidencePage; 