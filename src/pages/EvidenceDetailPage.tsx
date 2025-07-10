import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { evidenceService } from '../services/evidenceService';
import { challengeService } from '../services/challengeService';
import type { EvidenceResponse, Challenge } from '../types';

const EvidenceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const [evidence, setEvidence] = useState<EvidenceResponse | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!evidenceId) {
      setError('Evidence ID is required');
      setLoading(false);
      return;
    }

    loadEvidenceDetails();
  }, [evidenceId]);

  const loadEvidenceDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Loading evidence details for ID:', evidenceId);
      
      const evidenceIdNum = parseInt(evidenceId!);
      
      // Cargar evidencia primero
      const evidenceData = await evidenceService.getEvidenceById(evidenceIdNum);
      
      // Luego cargar el challenge usando el challengeId de la evidencia
      const challengeData = await challengeService.getChallengeById(evidenceData.challengeId);

      console.log('✅ Evidence details loaded:', { evidence: evidenceData, challenge: challengeData });
      
      setEvidence(evidenceData);
      setChallenge(challengeData as Challenge);
    } catch (err: any) {
      console.error('❌ Error loading evidence details:', err);
      setError(err.message || 'Error loading evidence details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getValidationStatus = (evidence: EvidenceResponse) => {
    if (evidence.aiValidated && evidence.locationValid) {
      return { text: 'Approved', color: 'text-green-600', bg: 'bg-green-100' };
    } else if (evidence.aiValidated || evidence.locationValid) {
      return { text: 'Partial', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    } else {
      return { text: 'Rejected', color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const handleBack = () => {
    navigate('/evidences');
  };

  const handleViewChallenge = () => {
    if (evidence) {
      navigate(`/challenges/${evidence.challengeId}`);
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
              <p className="text-gray-600">Loading evidence details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !evidence) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header active="evidences" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error || 'Evidence not found'}</p>
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

  const status = getValidationStatus(evidence);

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      <Header active="evidences" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Details</h1>
              <p className="text-gray-600">Challenge #{evidence.challengeId} • {formatDate(evidence.submittedAt)}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
              {status.text}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Evidence Placeholder - No Image Display */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📸</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Evidence Submitted</h3>
                <p className="text-sm text-gray-500">Challenge #{evidence.challengeId}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(evidence.submittedAt)}</p>
              </div>
            </div>
          </div>

          {/* Evidence Details */}
          <div className="space-y-6">
            {/* Challenge Info */}
            {challenge && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-gray-900">{challenge.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Description:</span>
                    <p className="text-gray-900">{challenge.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <p className="text-gray-900">{challenge.category}</p>
                  </div>
                  {challenge.location && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Registered Location:</span>
                      <p className="text-gray-900">{challenge.location.locationName}</p>
                      <p className="text-sm text-gray-600">
                        Coordinates: {challenge.location.latitude}, {challenge.location.longitude}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tolerance Radius: {challenge.location.toleranceRadius}m
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleViewChallenge}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  View Challenge
                </button>
              </div>
            )}

            {/* Validation Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Results</h3>
              <div className="space-y-4">
                {/* AI Validation */}
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">AI Validation</span>
                    <span className={evidence.aiValidated ? 'text-green-600' : 'text-red-600'}>
                      {evidence.aiValidated ? '✅ Valid' : '❌ Invalid'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {evidence.aiValidated 
                      ? 'The AI successfully validated that your image shows the challenge activity.'
                      : 'The AI could not validate that your image shows the required challenge activity. Make sure the image is clear and shows the specific activity.'
                    }
                  </p>
                </div>

                {/* Location Validation */}
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Location Validation</span>
                    <span className={evidence.locationValid ? 'text-green-600' : 'text-red-600'}>
                      {evidence.locationValid ? '✅ Valid' : '❌ Invalid'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {evidence.locationValid 
                      ? 'Your location was within the acceptable range for this challenge.'
                      : 'Your location was outside the acceptable range for this challenge. Make sure you are at the registered location when submitting evidence.'
                    }
                  </p>
                  {challenge?.location && !evidence.locationValid && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">Location Requirements:</p>
                      <p className="text-sm text-red-700">
                        You must be within {challenge.location.toleranceRadius}m of the registered location: {challenge.location.locationName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Evidence Description */}
            {evidence.description && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Description</h3>
                <p className="text-gray-700">{evidence.description}</p>
              </div>
            )}

            {/* Submission Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="text-gray-900">{formatDate(evidence.submittedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evidence ID:</span>
                  <span className="text-gray-900">#{evidence.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Challenge ID:</span>
                  <span className="text-gray-900">#{evidence.challengeId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EvidenceDetailPage; 