/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { initialHospitals, initialAmbulances, initialPatients, initialAdmins } from '../data/mockData';

import { loginHospitalReq, registerHospitalReq } from '../api/hospitalApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medilink_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('medilink_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medilink_user');
    }
  }, [user]);

  const login = async (role, credentials) => {
    if (role === 'hospital') {
      try {
        const data = await loginHospitalReq({ name: credentials.name, password: credentials.password });
        // Include token in the user object
        setUser({ role: 'hospital', hospitalId: data.hospitalId, name: data.name, token: data.token });
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message || 'Invalid hospital name or password' };
      }
    }

    if (role === 'ambulance') {
      const ambulance = initialAmbulances.find(
        a => a && a.phone === credentials.phone && a.driverName && a.driverName.toLowerCase() === credentials.name.toLowerCase()
      );
      if (ambulance) {
        setUser({ role: 'ambulance', ambulanceId: ambulance.id, name: ambulance.driverName, hospitalId: ambulance.hospitalId });
        return { success: true };
      }
      return { success: false, message: 'Invalid driver name or phone number' };
    }

    if (role === 'patient') {
      const patient = initialPatients.find(
        p => p && p.phone === credentials.phone && p.password === credentials.password
      );
      if (patient) {
        setUser({ role: 'patient', patientId: patient.id, name: patient.name, phone: patient.phone });
        return { success: true };
      }
      return { success: false, message: 'Invalid phone or password' };
    }

    if (role === 'admin') {
      const admin = initialAdmins.find(
        a => a && a.email.toLowerCase() === credentials.email.toLowerCase() && a.password === credentials.password
      );
      if (admin) {
        setUser({ role: 'admin', adminId: admin.id, name: admin.name, email: admin.email });
        return { success: true };
      }
      return { success: false, message: 'Invalid admin email or password' };
    }

    return { success: false, message: 'Invalid role' };
  };

  const register = async (role, data) => {
    if (role === 'patient') {
      const id = 'p' + Date.now();
      const newPatient = { id, name: data.name, phone: data.phone, password: data.password };
      initialPatients.push(newPatient);
      setUser({ role: 'patient', patientId: id, name: data.name, phone: data.phone });
      return { success: true };
    }
    if (role === 'ambulance') {
      const id = 'a' + Date.now();
      const hospitalId = data.hospitalId || 'h1';
      const newAmb = { id, vehicleNo: data.vehicleNo, driverName: data.name, phone: data.phone, hospitalId, status: 'available', lat: 28.6139, lng: 77.2090, type: data.type || 'BLS' };
      initialAmbulances.push(newAmb);
      setUser({ role: 'ambulance', ambulanceId: id, name: data.name, hospitalId });
      return { success: true };
    }
    if (role === 'hospital') {
      try {
        // Prepare the basic data required by our backend
        const apiData = {
          name: data.name,
          email: data.email || `${data.name.replace(/\s+/g, '').toLowerCase()}@hospital.com`, // dummy email if not provided by form
          phone: data.phone || '',
          address: data.address || '',
          password: data.password // Assuming the form collects this
        };
        
        await registerHospitalReq(apiData);
        // Automatically login after successful registration
        return await login('hospital', { name: data.name, password: data.password });
        
      } catch (err) {
        return { success: false, message: err.message || 'Registration failed' };
      }
    }
    return { success: false, message: 'Invalid role' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medilink_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
