import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { initialHospitals, initialAmbulances, initialRequests } from '../data/mockData';

const DataContext = createContext(null);

const mapAmbulanceStatus = (status) => {
  if (!status) return 'available';
  const s = status.toUpperCase();
  if (s === 'AVAILABLE') return 'available';
  if (s === 'ON_DUTY') return 'on-duty';
  if (s === 'OFFLINE') return 'offline';
  return status.toLowerCase();
};

const mapRequestStatus = (status) => {
  if (!status) return 'pending';
  return status.toLowerCase();
};

const mapBackendAmbulance = (a) => ({
  id: a.id,
  vehicleNo: a.ambulanceNumber,
  driverName: a.driverName,
  phone: a.phoneNumber,
  hospitalId: a.hospitalId,
  status: mapAmbulanceStatus(a.status),
  lat: a.currentLatitude ?? 28.6139,
  lng: a.currentLongitude ?? 77.2090,
  type: a.type || 'BLS',
});

const mapBackendHospital = (h) => ({
  id: h.id,
  name: h.name,
  phone: h.contactNumber,
  address: h.address,
  lat: h.latitude ?? 28.6139,
  lng: h.longitude ?? 77.2090,
});

const mapBackendRequest = (r) => ({
  id: r.id,
  status: mapRequestStatus(r.status),
  urgency: 'high',
  pickupLocation: r.pickupAddress,
  condition: r.description,
  createdAt: r.createdAt,
  from: {
    name: r.patient?.name || r.hospital?.name || 'Unknown',
    phone: r.patient?.phoneNumber || r.hospital?.contactNumber || '',
  },
});

export function DataProvider({ children }) {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [requests, setRequests] = useState(initialRequests);
  const [notifications, setNotifications] = useState([]);

  const updateHospitalResource = useCallback((hospitalId, field, value) => {
    setHospitals(prev => prev.map(h => {
      if (h.id !== hospitalId) return h;
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return { ...h, [parent]: { ...h[parent], [child]: value } };
      }
      return { ...h, [field]: value };
    }));
  }, []);

  const updateBloodBank = useCallback((hospitalId, bloodType, units) => {
    setHospitals(prev => prev.map(h => {
      if (h.id !== hospitalId) return h;
      return { ...h, bloodBank: { ...h.bloodBank, [bloodType]: units } };
    }));
  }, []);

  const updateSpecialist = useCallback((hospitalId, index, updates) => {
    setHospitals(prev => prev.map(h => {
      if (h.id !== hospitalId) return h;
      const specialists = [...h.specialists];
      specialists[index] = { ...specialists[index], ...updates };
      return { ...h, specialists };
    }));
  }, []);

  const addSpecialist = useCallback((hospitalId, specialist) => {
    setHospitals(prev => prev.map(h => {
      if (h.id !== hospitalId) return h;
      return { ...h, specialists: [...h.specialists, specialist] };
    }));
  }, []);

  // -------- REAL BACKEND AMBULANCE METHODS --------

  const fetchMyAmbulance = useCallback(async () => {
    const response = await api.get('/ambulances/me');
    return mapBackendAmbulance(response.data.data);
  }, []);

  const fetchMyHospital = useCallback(async () => {
    const response = await api.get('/ambulances/me');
    const hospital = response.data?.data?.hospital;
    return hospital ? mapBackendHospital(hospital) : null;
  }, []);

  const fetchAmbulancesByHospital = useCallback(async (hospitalId) => {
    const response = await api.get(`/ambulances/hospital/${hospitalId}`);
    return (response.data?.data || []).map(mapBackendAmbulance);
  }, []);

  const fetchAmbulanceRequests = useCallback(async () => {
    const response = await api.get('/requests/ambulance/me');
    return (response.data?.data || []).map(mapBackendRequest);
  }, []);

  const updateAmbulanceStatus = useCallback(async (ambulanceId, status) => {
    const backendStatus =
      status === 'available' ? 'AVAILABLE'
      : status === 'on-duty' ? 'ON_DUTY'
      : 'OFFLINE';

    const response = await api.patch('/ambulances/status', {
      status: backendStatus,
    });

    return mapBackendAmbulance(response.data.data);
  }, []);

  const updateRequestStatus = useCallback(async (requestId, status) => {
    const backendStatus =
      status === 'accepted' ? 'ACCEPTED'
      : status === 'rejected' ? 'REJECTED'
      : 'PENDING';

    const response = await api.patch(`/requests/${requestId}/status`, {
      status: backendStatus,
    });

    return response.data;
  }, []);

  // -------- EXISTING MOCK METHODS --------

  const createRequest = useCallback((request) => {
    const newReq = { ...request, id: 'req' + Date.now(), createdAt: new Date().toISOString(), status: 'pending' };
    setRequests(prev => [newReq, ...prev]);
    return newReq;
  }, []);

  const addNotification = useCallback((notification) => {
    const notif = { ...notification, id: 'n' + Date.now(), createdAt: new Date().toISOString(), read: false };
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notifId ? { ...n, read: true } : n
    ));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const getHospital = useCallback((id) => hospitals.find(h => h.id === id), [hospitals]);
  const getAmbulance = useCallback((id) => ambulances.find(a => a.id === id), [ambulances]);

  const getHospitalRequests = useCallback((hospitalId) => {
    return requests.filter(r => r.toHospitalId === hospitalId);
  }, [requests]);

  const getPatientRequests = useCallback((patientId) => {
    return requests.filter(r => r.from?.patientId === patientId);
  }, [requests]);

  return (
    <DataContext.Provider value={{
      hospitals, ambulances, requests, notifications,
      updateHospitalResource, updateBloodBank, updateSpecialist, addSpecialist,
      createRequest,
      addNotification, markNotificationRead, clearNotifications,
      getHospital, getAmbulance, getHospitalRequests, getPatientRequests,

      // REAL BACKEND METHODS
      fetchMyAmbulance,
      fetchMyHospital,
      fetchAmbulancesByHospital,
      fetchAmbulanceRequests,
      updateAmbulanceStatus,
      updateRequestStatus,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};