import React, { useState, useEffect } from 'react';
import eventsApi from './eventsApi';
import './EventsPage.css';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadEvents();
  }, [activeTab, selectedType]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      let response;
      
      if (activeTab === 'upcoming') {
        response = await eventsApi.fetchUpcomingEvents();
      } else if (activeTab === 'active') {
        response = await eventsApi.fetchActiveEvents();
      } else if (activeTab === 'featured') {
        response = await eventsApi.fetchFeaturedEvents();
      } else {
        response = await eventsApi.fetchEvents();
      }
      
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await eventsApi.searchEvents(searchQuery);
        setEvents(response.data);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDaysUntil = (dateString) => {
    const days = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days > 0) return `In ${days} days`;
    return 'Started';
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Campus Events & Activities</h1>
        <p>Discover and register for amazing events happening on campus</p>
      </div>

      <div className="events-search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search events by title, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="events-tabs">
        <button
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
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
        <div className="events-loading">Loading events...</div>
      ) : (
        <div className="events-grid">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="event-card">
                {event.image_url && (
                  <div className="event-image">
                    <img src={event.image_url} alt={event.title} />
                    {event.is_featured && <span className="featured-badge">Featured</span>}
                  </div>
                )}
                
                <div className="event-content">
                  <div className="event-status" style={{
                    backgroundColor: event.status === 'ongoing' ? '#10b981' : '#3b82f6'
                  }}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </div>

                  <h3 className="event-title">{event.title}</h3>
                  
                  <p className="event-description">{event.description.substring(0, 100)}...</p>

                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">⏰</span>
                      <span>{getDaysUntil(event.start_date)}</span>
                    </div>
                  </div>

                  {event.capacity && (
                    <div className="event-capacity">
                      <div className="capacity-bar">
                        <div 
                          className="capacity-filled" 
                          style={{ width: `${(event.current_registrations / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="capacity-text">
                        {event.current_registrations} / {event.capacity} registered
                      </span>
                    </div>
                  )}

                  {event.organizer && (
                    <p className="event-organizer">Organized by: {event.organizer}</p>
                  )}

                  <button className="register-button">
                    {event.registration_link ? 'Register Now' : 'Learn More'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">No events found. Check back soon!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
