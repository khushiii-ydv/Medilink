import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Hospital
import HospitalLayout from './pages/hospital/HospitalLayout';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import ResourceManagement from './pages/hospital/ResourceManagement';
import HospitalRequests from './pages/hospital/HospitalRequests';
import PatientRequests from './pages/hospital/PatientRequests';
import AmbulanceManagement from './pages/hospital/AmbulanceManagement';

// Ambulance
import AmbulanceLayout from './pages/ambulance/AmbulanceLayout';
import AmbulanceDashboard from './pages/ambulance/AmbulanceDashboard';
import AmbulanceRequestsPage from './pages/ambulance/AmbulanceRequests';
import AmbulanceFleet from './pages/ambulance/AmbulanceFleet';

// Patient
import PatientLayout from './pages/patient/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import SearchHospitals from './pages/patient/SearchHospitals';
import HospitalDetail from './pages/patient/HospitalDetail';
import PatientAmbulances from './pages/patient/PatientAmbulances';
import MyRequests from './pages/patient/MyRequests';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmergencyCases from './pages/admin/EmergencyCases';
import AdminHospitals from './pages/admin/AdminHospitals';
import AdminAmbulances from './pages/admin/AdminAmbulances';
import ResourceMonitor from './pages/admin/ResourceMonitor';


// Plans
import Plans from './pages/Plans';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--navbar-height)' }}>{children}</div>
    </>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--shadow-lg)',
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plans" element={<PublicLayout><Plans /></PublicLayout>} />

        {/* Hospital Dashboard */}
        <Route path="/hospital" element={
          <ProtectedRoute allowedRole="hospital"><HospitalLayout /></ProtectedRoute>
        }>
          <Route index element={<HospitalDashboard />} />
          <Route path="resources" element={<ResourceManagement />} />
          <Route path="requests" element={<HospitalRequests />} />
          <Route path="patient-requests" element={<PatientRequests />} />
          <Route path="ambulances" element={<AmbulanceManagement />} />
        </Route>

        {/* Ambulance Dashboard */}
        <Route path="/ambulance" element={
          <ProtectedRoute allowedRole="ambulance"><AmbulanceLayout /></ProtectedRoute>
        }>
          <Route index element={<AmbulanceDashboard />} />
          <Route path="requests" element={<AmbulanceRequestsPage />} />
          <Route path="fleet" element={<AmbulanceFleet />} />
        </Route>

        {/* Patient Dashboard */}
        <Route path="/patient" element={
          <ProtectedRoute allowedRole="patient"><PatientLayout /></ProtectedRoute>
        }>
          <Route index element={<PatientDashboard />} />
          <Route path="search" element={<SearchHospitals />} />
          <Route path="hospital/:id" element={<HospitalDetail />} />
          <Route path="ambulances" element={<PatientAmbulances />} />
          <Route path="my-requests" element={<MyRequests />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="emergency" element={<EmergencyCases />} />
          <Route path="hospitals" element={<AdminHospitals />} />
          <Route path="ambulances" element={<AdminAmbulances />} />
          <Route path="resources" element={<ResourceMonitor />} />
        </Route>

        {/* Doctor Dashboard (Reusing Emergency Cases and Admin Layout for simplicity, restricted to Doctor role) */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRole="doctor"><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="emergency" replace />} />
          <Route path="emergency" element={<EmergencyCases />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
