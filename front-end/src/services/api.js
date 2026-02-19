import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("lms_user");
      localStorage.removeItem("lms_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// AUTH
export const authAPI = {
  registerInternal: (data) => api.post("/auth/internal/register", data),
  loginInternal: (data) => api.post("/auth/internal/login", data),
  registerLearner: (data) => api.post("/auth/learner/register", data),
  loginLearner: (data) => api.post("/auth/learner/login", data),
};

// INTERNAL USERS
export const internalUserAPI = {
  getAll: () => api.get("/internal-users"),
  getById: (id) => api.get(`/internal-users/${id}`),
  update: (id, data) => api.put(`/internal-users/${id}`, data),
  delete: (id) => api.delete(`/internal-users/${id}`),
};

// LEARNERS
export const learnerAPI = {
  getAll: () => api.get("/learners"),
  getById: (id) => api.get(`/learners/${id}`),
  getProfile: () => api.get("/learners/me"),
  updateProfile: (data) => api.put("/learners/me", data),
  update: (id, data) => api.put(`/learners/${id}`, data),
  delete: (id) => api.delete(`/learners/${id}`),
};

// COURSES
export const courseAPI = {
  getAll: () => api.get("/courses"),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// LECTURES
export const lectureAPI = {
  getAll: () => api.get("/lectures"),
  getMyLectures: () => api.get("/lectures/my-lectures"),
  getByCourse: (courseId) => api.get(`/lectures/course/${courseId}`),
  getById: (id) => api.get(`/lectures/${id}`),
  create: (data) => api.post("/lectures", data),
  update: (id, data) => api.put(`/lectures/${id}`, data),
  delete: (id) => api.delete(`/lectures/${id}`),
};

// ENROLLMENTS
export const enrollmentAPI = {
  enroll: (data) => api.post("/enrollments", data),
  getAll: () => api.get("/enrollments"),
  getMy: () => api.get("/enrollments/my-enrollments"),
  getByCourse: (courseId) => api.get(`/enrollments/course/${courseId}`),
  getById: (id) => api.get(`/enrollments/${id}`),
  update: (id, data) => api.put(`/enrollments/${id}`, data),
  delete: (id) => api.delete(`/enrollments/${id}`),
};

// PAYMENTS
export const paymentAPI = {
  getAll: () => api.get("/payments"),
  getMy: () => api.get("/payments/my-payments"),
  getById: (id) => api.get(`/payments/${id}`),
};

// FEEDBACKS
export const feedbackAPI = {
  create: (data) => api.post("/feedbacks", data),
  getAll: () => api.get("/feedbacks"),
  getMy: () => api.get("/feedbacks/my-feedbacks"),
  getByCourse: (courseId) => api.get(`/feedbacks/course/${courseId}`),
  getById: (id) => api.get(`/feedbacks/${id}`),
  update: (id, data) => api.put(`/feedbacks/${id}`, data),
  delete: (id) => api.delete(`/feedbacks/${id}`),
};

// QUERIES
export const queryAPI = {
  create: (data) => api.post("/queries", data),
  getAll: () => api.get("/queries"),
  getMy: () => api.get("/queries/my-queries"),
  getByCourse: (courseId) => api.get(`/queries/course/${courseId}`),
  getById: (id) => api.get(`/queries/${id}`),
  update: (id, data) => api.put(`/queries/${id}`, data),
  delete: (id) => api.delete(`/queries/${id}`),
};

export default api;