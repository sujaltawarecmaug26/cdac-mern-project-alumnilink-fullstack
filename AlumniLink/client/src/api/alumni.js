import api from './axios.js';
export const alumniApi = {
  featured: () => api.get('/alumni/featured').then(r => r.data),
};
