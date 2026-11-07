import api from './axios.js';

export const profileApi = {
  me: () => api.get('/profile/me').then((r) => r.data),
  updateName: (name) => api.patch('/profile/name', { name }).then((r) => r.data),
  updateStudent: (body) => api.put('/profile/student', body).then((r) => r.data),
  updateAlumni: (body) => api.put('/profile/alumni', body).then((r) => r.data),
  uploadResume: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return api
      .post('/profile/resume', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
