import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { initialHospitals, initialAmbulances, initialPatients } from '../data/mockData';

const AuthContext = createContext(null);

const mapBackendRoleToFrontend = (role) => {
  if (role === 'AMBULANCE_DRIVER') return 'ambulance';
  if (role === 'HOSPITAL_ADMIN') return 'hospital';
  if (role === 'PATIENT') return 'patient';
  return role?.toLowerCase() || '';
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
      // REAL BACKEND LOGIN ONLY FOR AMBULANCE
      if (role === 'ambulance') {
        const response = await api.post('/auth/login', {
          phoneNumber: credentials.phone,
          password: credentials.password,
          role: 'AMBULANCE_DRIVER',
        });

        const token = response.data?.data?.token || response.data?.token;
        const backendUser = response.data?.data?.user || response.data?.user;

        if (!token || !backendUser) {
          return { success: false, message: 'Invalid backend login response' };
        }

        localStorage.setItem('medilink_token', token);

        // fetch ambulance profile after login
        const profileRes = await api.get('/ambulances/me');
        const ambulance = profileRes.data?.data;

        const normalizedUser = {
          role: 'ambulance',
          userId: backendUser.id,
          ambulanceId: ambulance?.id,
          hospitalId: ambulance?.hospitalId,
          name: ambulance?.driverName || backendUser.phoneNumber,
          phone: ambulance?.phoneNumber || backendUser.phoneNumber,
        };

        setUser(normalizedUser);
        return { success: true };
      }

      // MOCK FLOW FOR HOSPITAL
      if (role === 'hospital') {
        const hospital = initialHospitals.find(
          h => h.name.toLowerCase() === credentials.name.toLowerCase() && h.password === credentials.password
        );
        if (hospital) {
          setUser({ role: 'hospital', hospitalId: hospital.id, name: hospital.name });
          return { success: true };
        }
        return { success: false, message: 'Invalid hospital name or password' };
      }

      // MOCK FLOW FOR PATIENT
      if (role === 'patient') {
        const patient = initialPatients.find(
          p => p.phone === credentials.phone && p.password === credentials.password
        );
        if (patient) {
          setUser({ role: 'patient', patientId: patient.id, name: patient.name, phone: patient.phone });
          return { success: true };
        }
        return { success: false, message: 'Invalid phone or password' };
      }

      return { success: false, message: 'Invalid role' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (role, data) => {
    try {
      // REAL BACKEND REGISTER ONLY FOR AMBULANCE
      if (role === 'ambulance') {
        const response = await api.post('/auth/register/ambulance', {
          driverName: data.name,
          phoneNumber: data.phone,
          password: data.password,
          ambulanceNumber: data.vehicleNo,
          hospitalId: data.hospitalId,
        });

        const token = response.data?.data?.token || response.data?.token;
        const backendUser = response.data?.data?.user || response.data?.user;

        if (token) {
          localStorage.setItem('medilink_token', token);
        }

        const profileRes = await api.get('/ambulances/me');
        const ambulance = profileRes.data?.data;

        const normalizedUser = {
          role: 'ambulance',
          userId: backendUser?.id,
          ambulanceId: ambulance?.id,
          hospitalId: ambulance?.hospitalId,
          name: ambulance?.driverName,
          phone: ambulance?.phoneNumber,
        };

        setUser(normalizedUser);
        return { success: true };
      }

      // MOCK PATIENT REGISTER
      if (role === 'patient') {
        const id = 'p' + Date.now();
        const newPatient = { id, name: data.name, phone: data.phone, password: data.password };
        initialPatients.push(newPatient);
        setUser({ role: 'patient', patientId: id, name: data.name, phone: data.phone });
        return { success: true };
      }

      // MOCK HOSPITAL
      if (role === 'hospital') {
        const hospital = initialHospitals.find(
          h => h.name.toLowerCase() === data.name.toLowerCase() && h.password === data.password
        );
        if (hospital) {
          setUser({ role: 'hospital', hospitalId: hospital.id, name: hospital.name });
          return { success: true };
        }
        return { success: false, message: 'Invalid hospital name or password' };
      }

      return { success: false, message: 'Invalid role' };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medilink_user');
    localStorage.removeItem('medilink_token');
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