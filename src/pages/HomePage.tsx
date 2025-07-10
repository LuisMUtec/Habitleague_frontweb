import React, { useEffect } from 'react';
import { useChallenges } from '../hooks/useChallenges';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const {  } = useAuth();
  const {
    featuredChallenges,
    popularChallenges,
    loading,
    error,
    fetchFeaturedChallenges,
    fetchPopularChallenges
  } = useChallenges();

  useEffect(() => {
    fetchFeaturedChallenges();
    fetchPopularChallenges();
  }, [fetchFeaturedChallenges, fetchPopularChallenges]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Welcome to HabitLeague</h1>
        <p className="home-subtitle">Join challenges, build habits, and compete with others</p>
        <div className="home-actions">
          <button className="home-btn">Learn More</button>
        </div>
      </header>

      <section className="home-section">
        <h2 className="home-section-title">Featured Challenges</h2>
        {error && (
          <div className="home-error">{error}</div>
        )}
        <div className="home-challenge-list">
          {loading ? (
            <div className="home-loading">Loading...</div>
          ) : (
            featuredChallenges.map((challenge) => (
              <div key={challenge.id} className="home-challenge-card">
                <div className="home-challenge-header">
                  <span className="home-challenge-category">{challenge.category}</span>
                  <span className="home-challenge-fee">${challenge.entryFee}</span>
                </div>
                <h3 className="home-challenge-name">{challenge.name}</h3>
                <p className="home-challenge-desc">{challenge.description}</p>
                <div className="home-challenge-meta">
                  <span>{challenge.durationDays} days</span>
                  <span>{challenge.participantsCount || 0} participants</span>
                </div>
                <button className="home-btn home-challenge-btn">Join Challenge</button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">Popular Challenges</h2>
        <div className="home-challenge-list">
          {popularChallenges.map((challenge) => (
            <div key={challenge.id} className="home-challenge-card">
              <div className="home-challenge-header">
                <span className="home-challenge-category">{challenge.category}</span>
                <span className="home-challenge-fee">${challenge.entryFee}</span>
              </div>
              <h3 className="home-challenge-name">{challenge.name}</h3>
              <p className="home-challenge-desc">{challenge.description}</p>
              <div className="home-challenge-meta">
                <span>{challenge.durationDays} days</span>
                <span>{challenge.participantsCount || 0} participants</span>
              </div>
              <button className="home-btn home-challenge-btn">Join Challenge</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage; 