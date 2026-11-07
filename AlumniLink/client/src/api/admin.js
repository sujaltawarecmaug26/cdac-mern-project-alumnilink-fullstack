import api from './axios.js';
export const adminApi = {
  listAlumni: (params) => api.get('/admin/alumni', { params }).then(r => r.data),
  listUsers: (params) => api.get('/admin/users', { params }).then(r => r.data),
  verifyAlumni: (userId, body) => api.patch(`/admin/alumni/${userId}`, body).then(r => r.data),
};
