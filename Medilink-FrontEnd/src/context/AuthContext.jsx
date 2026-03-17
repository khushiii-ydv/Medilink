/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { loginReq, registerHospitalReq } from '../api/hospitalApi';
import { registerPatientReq } from '../api/patientApi';
import { registerAmbulanceReq } from '../api/ambulanceApi';

const AuthContext = createContext(null);

/**
 * useAuth hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

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
    try {
      // All roles (hospital, admin, doctor, patient, ambulance) now use the same API endpoint
      const data = await loginReq(credentials);
      
      const userObj = {
        role: data.role,
        name: data.name,
        token: data.token,
        id: data.id,
        ...(data.role === 'patient' && { patientId: data.id }),
        ...(data.role === 'ambulance' && { ambulanceId: data.id }),
        ...(data.hospitalId && { hospitalId: data.hospitalId }),
      };

      setUser(userObj);
      return { success: true, name: data.name };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err.message || 'Invalid credentials' };
    }
  };

  const register = async (role, data) => {
    try {
      let result;
      if (role === 'patient') {
        const apiData = {
          name: data.name,
          phone: data.phone,
          password: data.password
        };
        await registerPatientReq(apiData);
        return await login('patient', { phone: data.phone, password: data.password });
      }
      
      if (role === 'ambulance') {
        const apiData = {
          driverName: data.name,
          vehicleNo: data.vehicleNo,
          phone: data.phone,
          password: data.password,
          hospitalId: data.hospitalId || 'h1', // Default hospital if none selected
          type: data.type || 'BLS',
          status: 'AVAILABLE'
        };
        await registerAmbulanceReq(apiData);
        return await login('ambulance', { name: data.name, password: data.password });
      }
      
      if (role === 'hospital') {
        const apiData = {
          name: data.name,
          email: data.email || `${data.name.replace(/\s+/g, '').toLowerCase()}@hospital.com`,
          phone: data.phone || '',
          address: data.address || '',
          password: data.password
        };
        await registerHospitalReq(apiData);
        return await login('hospital', { name: data.name, password: data.password });
      }
      
      return { success: false, message: 'Invalid role' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: err.message || 'Registration failed' };
    }
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
