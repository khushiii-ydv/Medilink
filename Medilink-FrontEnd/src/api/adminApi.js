/**
 * api/adminApi.js
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}) => {
  let token = null;
  const savedUser = localStorage.getItem('medilink_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      token = user.token;
    } catch (e) {
      console.error('Failed to parse user for token');
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || result.message || 'API request failed');
  }

  return result.data;
};

export const getAllHospitals = () => apiFetch('/admin/hospitals');
export const getSystemDoctors = () => apiFetch('/admin/system-doctors');
export const getPatientRequests = () => apiFetch('/admin/patient-requests');
export const assignRequestToDoctor = (requestId, doctorId) => 
  apiFetch(`/admin/requests/${requestId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ doctorId })
  });
