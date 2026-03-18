import React, { useState, useEffect } from 'react';
import eventsApi from './eventsApi';
import './HackathonsPage.css';

const HackathonsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    loadHackathons();
  }, [activeTab, difficultyFilter]);

  const loadHackathons = async () => {
    setLoading(true);
    try {
      let response;
      
      if (activeTab === 'upcoming') {
        response = await eventsApi.fetchUpcomingHackathons();
      } else if (activeTab === 'active') {
        response = await eventsApi.fetchActiveHackathons();
      } else if (activeTab === 'featured') {
        response = await eventsApi.fetchFeaturedHackathons();
      } else {
        response = await eventsApi.fetchHackathons();
      }
      
      setHackathons(response.data);
    } catch (error) {
      console.error('Error loading hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await eventsApi.searchHackathons(searchQuery);
        setHackathons(response.data);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#667eea';
    }
  };

  const getDifficultyStars = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '⭐';
      case 'intermediate':
        return '⭐⭐';
      case 'advanced':
        return '⭐⭐⭐';
      default:
        return '';
    }
  };

  const getDaysUntil = (dateString) => {
    const days = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days > 0) return `In ${days} days`;
    return 'Started';
  };

  return (
    <div className="hackathons-page">
      <div className="hackathons-header">
        <h1>Hackathons & Coding Competitions</h1>
        <p>Showcase your skills, collaborate with teams, and win amazing prizes</p>
      </div>

      <div className="hackathons-search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search hackathons by title, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        <div className="difficulty-filter">
          <button
            className={`filter-btn ${difficultyFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('all')}
          >
            All Levels
          </button>
          <button
            className={`filter-btn ${difficultyFilter === 'beginner' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('beginner')}
          >
            Beginner
          </button>
          <button
            className={`filter-btn ${difficultyFilter === 'intermediate' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('intermediate')}
          >
            Intermediate
          </button>
          <button
            className={`filter-btn ${difficultyFilter === 'advanced' ? 'active' : ''}`}
            onClick={() => setDifficultyFilter('advanced')}
          >
            Advanced
          </button>
        </div>
      </div>

      <div className="hackathons-tabs">
        <button
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Hackathons
        </button>
        <button
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Happening Now
        </button>
        <button
          className={`tab ${activeTab === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          Featured
        </button>
      </div>

      {loading ? (
        <div className="hackathons-loading">Loading hackathons...</div>
      ) : (
        <div className="hackathons-grid">
          {hackathons && hackathons.length > 0 ? (
            hackathons.map((hackathon) => (
              <div key={hackathon.id} className="hackathon-card">
                {hackathon.image_url && (
                  <div className="hackathon-image">
                    <img src={hackathon.image_url} alt={hackathon.title} />
                    {hackathon.is_featured && <span className="featured-badge">Featured</span>}
                  </div>
                )}
                
                <div className="hackathon-content">
                  <div className="hackathon-header">
                    <h3 className="hackathon-title">{hackathon.title}</h3>
                    <div 
                      className="difficulty-badge" 
                      style={{ backgroundColor: getDifficultyColor(hackathon.difficulty) }}
                    >
                      {getDifficultyStars(hackathon.difficulty)}
                    </div>
                  </div>

                  <div className="hackathon-status" style={{
                    backgroundColor: hackathon.status === 'ongoing' ? '#10b981' : '#3b82f6'
                  }}>
                    {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                  </div>

                  <p className="hackathon-description">{hackathon.description.substring(0, 100)}...</p>

                  <div className="hackathon-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{hackathon.location}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span>{formatDate(hackathon.start_date)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">⏰</span>
                      <span>{getDaysUntil(hackathon.start_date)}</span>
                    </div>
                  </div>

                  <div className="hackathon-stats">
                    <div className="stat">
                      <span className="stat-label">Teams</span>
                      <span className="stat-value">{hackathon.team_count}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Participants</span>
                      <span className="stat-value">{hackathon.participant_count}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Team Size</span>
                      <span className="stat-value">{hackathon.min_team_size}-{hackathon.max_team_size}</span>
                    </div>
                  </div>

                  {hackathon.prizes && hackathon.prizes.length > 0 && (
                    <div className="hackathon-prizes">
                      <h4>Prizes</h4>
                      {hackathon.prizes.map((prize, index) => (
                        <div key={index} className="prize-item">
                          <span className="prize-place">🏆 {prize.place === 1 ? '1st' : prize.place === 2 ? '2nd' : '3rd'} Prize</span>
                          <span className="prize-amount">₹{prize.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {hackathon.organizer && (
                    <p className="hackathon-organizer">By {hackathon.organizer}</p>
                  )}

                  <button className="register-button">
                    {hackathon.registration_link ? 'Register Now' : 'Learn More'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-hackathons">No hackathons found. Check back soon!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HackathonsPage;
