import api from './axios.js';

export const authApi = {
  register: (body) => api.post('/auth/register', body).then((r) => r.data),
  login: (body) => api.post('/auth/login', body).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  changePassword: (body) => api.patch('/auth/password', body).then((r) => r.data),
  forgot: (body) => api.post('/auth/forgot', body).then((r) => r.data),
  reset: (body) => api.post('/auth/reset', body).then((r) => r.data),
};
