import api from './axios.js';
export const jobsApi = {
  list: (params) => api.get('/jobs', { params }).then(r => r.data),
  get: (id) => api.get(`/jobs/${id}`).then(r => r.data),
  mine: () => api.get('/jobs/mine').then(r => r.data),
  create: (body) => api.post('/jobs', body).then(r => r.data),
  update: (id, body) => api.put(`/jobs/${id}`, body).then(r => r.data),
  close: (id) => api.patch(`/jobs/${id}/close`).then(r => r.data),
  apply: (id, body) => api.post(`/jobs/${id}/apply`, body).then(r => r.data),
};
