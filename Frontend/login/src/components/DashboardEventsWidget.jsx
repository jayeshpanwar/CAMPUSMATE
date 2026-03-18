import React, { useState, useEffect } from 'react';
import eventsApi from './eventsApi';
import './DashboardEventsWidget.css';

const DashboardEventsWidget = () => {
  const [events, setEvents] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedEvents();
  }, []);

  const loadFeaturedEvents = async () => {
    setLoading(true);
    try {
      const [eventsRes, hackathonsRes] = await Promise.all([
        eventsApi.fetchFeaturedEvents(),
        eventsApi.fetchFeaturedHackathons()
      ]);
      setEvents(eventsRes.data.slice(0, 3));
      setHackathons(hackathonsRes.data.slice(0, 2));
    } catch (error) {
      console.error('Error loading featured events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDaysUntil = (dateString) => {
    const days = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days > 0) return `${days}d`;
    return 'Started';
  };

  return (
    <div className="dashboard-events-widget">
      <div className="widget-header">
        <h3>🎉 Featured Events</h3>
        <a href="/events" className="view-all">View All</a>
      </div>

      {loading ? (
        <div className="widget-loading">Loading...</div>
      ) : (
        <>
          {events && events.length > 0 && (
            <div className="events-list">
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-badge">{getDaysUntil(event.start_date)}</div>
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p className="event-date">📅 {formatDate(event.start_date)}</p>
                    <p className="event-location">📍 {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hackathons && hackathons.length > 0 && (
            <div className="hackathons-list">
              <h4 className="section-title">💻 Active Hackathons</h4>
              {hackathons.map((hackathon) => (
                <div key={hackathon.id} className="hackathon-item">
                  <div className="hackathon-badge">{getDaysUntil(hackathon.start_date)}</div>
                  <div className="hackathon-info">
                    <h5>{hackathon.title}</h5>
                    <div className="hackathon-meta">
                      <span className="difficulty">{hackathon.difficulty}</span>
                      <span className="teams">{hackathon.team_count} teams</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(!events || events.length === 0) && (!hackathons || hackathons.length === 0) && (
            <div className="no-events">No upcoming featured events</div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardEventsWidget;
