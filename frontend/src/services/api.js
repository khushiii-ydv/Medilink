import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("medilink_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  registerPatient: (data) => api.post("/auth/register/patient", data),
  registerHospital: (data) => api.post("/auth/register/hospital", data),
  registerAmbulance: (data) => api.post("/auth/register/ambulance", data),
};

export const patientAPI = {
  getProfile: () => api.get("/patients/profile"),
};

export const hospitalAPI = {
  getAllHospitals: () => api.get("/hospitals"),
  getMyProfile: () => api.get("/hospitals/profile"),
};

export const ambulanceAPI = {
  getMyProfile: () => api.get("/ambulances/profile"),
};

export const requestAPI = {
  getMyAdmissions: () => api.get("/requests/admissions/my"),
  getMyAmbulanceRequests: () => api.get("/requests/ambulances/my"),
};

export const notificationAPI = {
  getMyNotifications: () => api.get("/notifications/my"),
};

export default api;