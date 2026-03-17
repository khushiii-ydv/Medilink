import { createContext, useContext, useState, useCallback } from 'react';
import { initialHospitals, initialAmbulances, initialRequests } from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [hospitals, setHospitals] = useState(() => initialHospitals.filter(Boolean));
  const [ambulances, setAmbulances] = useState(() => initialAmbulances.filter(Boolean));
  const [requests, setRequests] = useState(() => initialRequests.filter(Boolean));
  const [notifications, setNotifications] = useState([]);

  // Hospital resource updates
  const updateHospitalResource = useCallback((hospitalId, field, value) => {
    setHospitals(prev => prev.filter(Boolean).map(h => {
      if (!h || h.id !== hospitalId) return h;
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

  // Ambulance updates
  const updateAmbulanceStatus = useCallback((ambulanceId, status) => {
    setAmbulances(prev => prev.map(a =>
      a.id === ambulanceId ? { ...a, status } : a
    ));
  }, []);

  // Request management
  const createRequest = useCallback((request) => {
    const newReq = { ...request, id: 'req' + Date.now(), createdAt: new Date().toISOString(), status: 'pending' };
    setRequests(prev => [newReq, ...prev]);
    addNotification({
      title: 'New Request',
      message: `New ${request.type} request received`,
      type: 'info',
      targetRole: request.type === 'ambulance-request' ? 'ambulance' : 'hospital',
      targetId: request.toHospitalId || request.toAmbulanceId,
    });
    return newReq;
  }, []);

  const updateRequestStatus = useCallback((requestId, status, notes) => {
    setRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, status, ...(notes ? { responseNotes: notes } : {}) } : r
    ));
  }, []);

  // Notifications
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

  const getAmbulanceRequests = useCallback((ambulanceId) => {
    return requests.filter(r => r.toAmbulanceId === ambulanceId);
  }, [requests]);

  const getPatientRequests = useCallback((patientId) => {
    return requests.filter(r => r.from?.patientId === patientId);
  }, [requests]);

  const getAmbulancesByHospital = useCallback((hospitalId) => {
    return ambulances.filter(a => a.hospitalId === hospitalId);
  }, [ambulances]);

  return (
    <DataContext.Provider value={{
      hospitals, ambulances, requests, notifications,
      updateHospitalResource, updateBloodBank, updateSpecialist, addSpecialist,
      updateAmbulanceStatus,
      createRequest, updateRequestStatus,
      addNotification, markNotificationRead, clearNotifications,
      getHospital, getAmbulance,
      getHospitalRequests, getAmbulanceRequests, getPatientRequests,
      getAmbulancesByHospital,
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
