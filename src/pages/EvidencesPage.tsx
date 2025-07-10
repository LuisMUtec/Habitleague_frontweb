import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import { evidenceService } from '../services/evidenceService';
import type { EvidenceResponse, EvidenceStatsResponse } from '../types';

type Tab = 'all' | 'stats';

const EvidencesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<Tab>('all');
  const [evidences, setEvidences] = useState<EvidenceResponse[]>([]);
  const [stats, setStats] = useState<EvidenceStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Leer el parámetro tab de la URL al cargar la página
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab') as Tab;
    
    if (tabParam && ['all', 'stats'].includes(tabParam)) {
      setTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading evidence data...');
      
      // Cargar evidencias y estadísticas en paralelo
      const [evidencesData, statsData] = await Promise.all([
        evidenceService.getMyEvidences(),
        evidenceService.getMyEvidenceStats()
      ]);

      console.log('✅ Evidence data loaded:', { evidences: evidencesData, stats: statsData });
      
      setEvidences(evidencesData);
      setStats(statsData);
    } catch (err: any) {
      console.error('❌ Error loading evidence data:', err);
      setError(err.message || 'Error loading evidence data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const handleSubmitNewEvidence = () => {
    navigate('/evidences/submit');
  };

  const handleViewChallenge = (challengeId: number) => {
    navigate(`/challenges/${challengeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1EADA]">
        <Header active="evidences" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 animate-spin text-[#584738]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-[#584738]">Loading evidences...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F1EADA]">
        <Header active="evidences" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-6 py-2 bg-[#B59E7D] text-[#F1EADA] rounded-lg hover:bg-[#584738]"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EADA]">
      <Header active="evidences" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#584738] mb-2">My Evidences</h1>
              <p className="text-[#AAA396]">Track your daily challenge submissions and progress</p>
            </div>
            <button
              onClick={handleSubmitNewEvidence}
              className="px-6 py-2 bg-[#B59E7D] text-[#F1EADA] rounded-lg hover:bg-[#584738] flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Submit Evidence</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-[#CEC1A8]">
            {[
              { key: 'all', label: 'All Evidences' },
              { key: 'stats', label: 'Statistics' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key as Tab)}
                className={`pb-2 font-medium ${
                  tab === key
                    ? 'border-b-2 border-[#B59E7D] text-[#584738]'
                    : 'text-[#AAA396]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {tab === 'all' && (
          <div className="space-y-6">
            {evidences.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl shadow p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-[#CEC1A8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📸</span>
                  </div>
                  <h3 className="text-lg font-medium text-[#584738] mb-2">No evidences yet</h3>
                  <p className="text-[#AAA396] mb-6">
                    Start submitting daily evidences to track your challenge progress!
                  </p>
                  <button
                    onClick={handleSubmitNewEvidence}
                    className="px-6 py-2 bg-[#B59E7D] text-[#F1EADA] rounded-lg hover:bg-[#584738]"
                  >
                    Submit First Evidence
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {evidences.map((evidence) => {
                  const status = getValidationStatus(evidence);
                  return (
                    <div
                      key={evidence.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Evidence Placeholder - No Image Display */}
                      <div className="aspect-square bg-[#CEC1A8] relative flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-[#F1EADA] rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">📸</span>
                          </div>
                          <p className="text-sm text-[#584738]">Evidence Submitted</p>
                        </div>
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.text}
                        </div>
                      </div>

                      {/* Evidence Details */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-[#584738]">
                            Challenge #{evidence.challengeId}
                          </h3>
                          <span className="text-sm text-[#AAA396]">
                            {formatDate(evidence.submittedAt)}
                          </span>
                        </div>

                        {evidence.description && (
                          <p className="text-[#AAA396] text-sm mb-4 line-clamp-2">
                            {evidence.description}
                          </p>
                        )}

                        {/* Validation Status */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#AAA396]">AI Validation:</span>
                            <span className={evidence.aiValidated ? 'text-green-600' : 'text-red-600'}>
                              {evidence.aiValidated ? '✅ Valid' : '❌ Invalid'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#AAA396]">Location:</span>
                            <span className={evidence.locationValid ? 'text-green-600' : 'text-red-600'}>
                              {evidence.locationValid ? '✅ Valid' : '❌ Invalid'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewChallenge(evidence.challengeId)}
                            className="w-full px-3 py-2 bg-[#CEC1A8] text-[#584738] rounded-lg hover:bg-[#B59E7D] hover:text-[#F1EADA] text-sm"
                          >
                            View Challenge
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'stats' && stats && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <div className="text-3xl font-bold text-[#584738] mb-2">
                  {stats.statistics.totalEvidences}
                </div>
                <div className="text-sm text-[#AAA396]">Total Evidences</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <div className="text-3xl font-bold text-[#B59E7D] mb-2">
                  {stats.statistics.bothValid}
                </div>
                <div className="text-sm text-[#AAA396]">Fully Valid</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <div className="text-3xl font-bold text-[#AAA396] mb-2">
                  {stats.statistics.aiValidated}
                </div>
                <div className="text-sm text-[#AAA396]">AI Validated</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <div className="text-3xl font-bold text-[#CEC1A8] mb-2">
                  {stats.statistics.locationValid}
                </div>
                <div className="text-sm text-[#AAA396]">Location Valid</div>
              </div>
            </div>

            {/* Success Rates */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-[#584738] mb-4">Success Rates</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#584738]">AI Validation</span>
                    <span className="text-[#584738]">{stats.statistics.successRates.ai}%</span>
                  </div>
                  <div className="w-full bg-[#CEC1A8] rounded-full h-2">
                    <div
                      className="bg-[#584738] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.statistics.successRates.ai}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#584738]">Location Validation</span>
                    <span className="text-[#584738]">{stats.statistics.successRates.location}%</span>
                  </div>
                  <div className="w-full bg-[#CEC1A8] rounded-full h-2">
                    <div
                      className="bg-[#584738] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.statistics.successRates.location}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#584738]">Overall Success</span>
                    <span className="text-[#584738]">{stats.statistics.successRates.overall}%</span>
                  </div>
                  <div className="w-full bg-[#CEC1A8] rounded-full h-2">
                    <div
                      className="bg-[#584738] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.statistics.successRates.overall}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interpretations */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-[#584738] mb-4">Performance Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#F1EADA] rounded-lg">
                  <h4 className="font-medium text-[#584738] mb-2">AI Validation</h4>
                  <p className="text-[#584738] text-sm">{stats.interpretation.ai}</p>
                </div>
                <div className="p-4 bg-[#CEC1A8] rounded-lg">
                  <h4 className="font-medium text-[#584738] mb-2">Location Accuracy</h4>
                  <p className="text-[#584738] text-sm">{stats.interpretation.location}</p>
                </div>
                <div className="p-4 bg-[#B59E7D] rounded-lg">
                  <h4 className="font-medium text-[#F1EADA] mb-2">Overall Performance</h4>
                  <p className="text-[#F1EADA] text-sm">{stats.interpretation.overall}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EvidencesPage; 