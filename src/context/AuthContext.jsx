import { createContext, useContext, useState, useEffect } from 'react';
import { initialHospitals, initialAmbulances, initialPatients, initialAdmins } from '../data/mockData';

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

  const login = (role, credentials) => {
    if (role === 'hospital') {
    const hospital = initialHospitals.find(
        h => h && h.name && h.name.toLowerCase() === credentials.name.toLowerCase() && h.password === credentials.password
      );
      if (hospital) {
        setUser({ role: 'hospital', hospitalId: hospital.id, name: hospital.name });
        return { success: true };
      }
      return { success: false, message: 'Invalid hospital name or password' };
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

  const register = (role, data) => {
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
      // For demo: hospitals are pre-registered. Just login.
      return login('hospital', { name: data.name, password: data.password });
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
