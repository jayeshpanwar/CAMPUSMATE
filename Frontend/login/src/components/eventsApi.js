import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/events';

const eventsApi = {
  // Events endpoints
  fetchEvents: () => axios.get(`${API_BASE_URL}/events/`),
  fetchEventById: (id) => axios.get(`${API_BASE_URL}/events/${id}/`),
  fetchUpcomingEvents: () => axios.get(`${API_BASE_URL}/events/upcoming/`),
  fetchActiveEvents: () => axios.get(`${API_BASE_URL}/events/active/`),
  fetchFeaturedEvents: () => axios.get(`${API_BASE_URL}/events/featured/`),
  searchEvents: (query) => axios.get(`${API_BASE_URL}/events/search/`, { params: { q: query } }),
  fetchEventsByType: (type) => axios.get(`${API_BASE_URL}/events/by_type/`, { params: { type } }),
  createEvent: (data) => axios.post(`${API_BASE_URL}/events/`, data),
  updateEvent: (id, data) => axios.put(`${API_BASE_URL}/events/${id}/`, data),
  deleteEvent: (id) => axios.delete(`${API_BASE_URL}/events/${id}/`),

  // Hackathons endpoints
  fetchHackathons: () => axios.get(`${API_BASE_URL}/hackathons/`),
  fetchHackathonById: (id) => axios.get(`${API_BASE_URL}/hackathons/${id}/`),
  fetchUpcomingHackathons: () => axios.get(`${API_BASE_URL}/hackathons/upcoming/`),
  fetchActiveHackathons: () => axios.get(`${API_BASE_URL}/hackathons/active/`),
  fetchFeaturedHackathons: () => axios.get(`${API_BASE_URL}/hackathons/featured/`),
  searchHackathons: (query) => axios.get(`${API_BASE_URL}/hackathons/search/`, { params: { q: query } }),
  fetchHackathonsByDifficulty: (level) => axios.get(`${API_BASE_URL}/hackathons/by_difficulty/`, { params: { level } }),
  createHackathon: (data) => axios.post(`${API_BASE_URL}/hackathons/`, data),
  updateHackathon: (id, data) => axios.put(`${API_BASE_URL}/hackathons/${id}/`, data),
  deleteHackathon: (id) => axios.delete(`${API_BASE_URL}/hackathons/${id}/`),

  // Categories
  fetchCategories: () => axios.get(`${API_BASE_URL}/categories/`),
  createCategory: (data) => axios.post(`${API_BASE_URL}/categories/`, data),

  // Fetch logs
  fetchLogs: () => axios.get(`${API_BASE_URL}/fetch-logs/`),
};

export default eventsApi;
