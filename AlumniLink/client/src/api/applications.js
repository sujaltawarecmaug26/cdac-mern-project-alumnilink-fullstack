import api from "./axios.js";

export const applicationsApi = {
  mine: () => api.get("/applications/my").then((r) => r.data),
  inbox: (params) =>
    api.get("/applications/inbox", { params }).then((r) => r.data),
  decide: (id, body) =>
    api.patch(`/applications/${id}/status`, body).then((r) => r.data),
  downloadResume: async (id, filename = "resume.pdf") => {
    const response = await api.get(`/applications/${id}/resume`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
  contact: (id) => api.get(`/applications/${id}/contact`).then((r) => r.data),
};
