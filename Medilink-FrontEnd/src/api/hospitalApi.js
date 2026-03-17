/**
 * src/api/hospitalApi.js
 * All Hospital Dashboard API functions.
 * Use these in components instead of DataContext mock helpers.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Generic fetch helper with error handling ─────────────────────────────────
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  // Retrieve token from localStorage if user is logged in
  const savedUser = localStorage.getItem('medilink_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error('Failed to parse user from local storage');
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { ...headers, ...(options.headers || {}) },
    ...options,
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data.data; // unwrap the { success, data } envelope
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function loginReq(credentials) {
  // credentials can be { name, password } or { email, password }
  return apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function registerHospitalReq(hospitalData) {
  return apiFetch('/hospital', {
    method: 'POST',
    body: JSON.stringify(hospitalData),
  });
}

// ─── Fetch all hospitals (used for network map + nearby list) ────────────────
export async function getAllHospitals() {
  return apiFetch('/hospitals');
}

// ─── Fetch a single hospital profile + resources ──────────────────────────────
export async function getHospitalById(id) {
  return apiFetch(`/hospital/${id}`);
}

// ─── Update hospital profile (name, phone, address, etc.) ───────────────────
export async function updateHospitalProfile(id, profileData) {
  return apiFetch(`/hospital/${id}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

// ─── Fetch resource counts only ──────────────────────────────────────────────
export async function getHospitalResources(id) {
  return apiFetch(`/hospital/${id}/resources`);
}

// ─── Update beds / ventilators / oxygen ──────────────────────────────────────
export async function updateHospitalResources(id, resourceData) {
  return apiFetch(`/hospital/${id}/resources`, {
    method: 'PUT',
    body: JSON.stringify(resourceData),
  });
}

// ─── Update blood bank (accepts { 'A+': 50, 'B-': 12, ... }) ─────────────────
export async function updateBloodBank(id, bloodData) {
  return apiFetch(`/hospital/${id}/bloodbank`, {
    method: 'PUT',
    body: JSON.stringify(bloodData),
  });
}

// ─── Dashboard summary card data ─────────────────────────────────────────────
export async function getHospitalDashboardSummary(id) {
  return apiFetch(`/hospital/${id}/dashboard-summary`);
}

// ─── Specialists ─────────────────────────────────────────────────────────────
export async function addSpecialist(hospitalId, specialistData) {
  return apiFetch(`/hospital/${hospitalId}/specialists`, {
    method: 'POST',
    body: JSON.stringify(specialistData),
  });
}

export async function updateSpecialist(hospitalId, specialistId, updates) {
  return apiFetch(`/hospital/${hospitalId}/specialists/${specialistId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteSpecialist(hospitalId, specialistId) {
  return apiFetch(`/hospital/${hospitalId}/specialists/${specialistId}`, {
    method: 'DELETE',
  });
}
