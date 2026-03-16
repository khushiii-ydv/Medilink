import { createContext, useContext, useState, useEffect } from "react";
import { patientAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [patientProfile, setPatientProfile] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "patient") {
      fetchPatientData();
    }
  }, [isAuthenticated, user]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getProfile();
      setPatientProfile(response.data.data);
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      toast.error(error.response?.data?.message || "Failed to load patient profile");
    } finally {
      setLoading(false);
    }
  };

  const getPatientRequests = () => requests;

  return (
    <DataContext.Provider
      value={{
        patientProfile,
        hospitals,
        ambulances,
        requests,
        notifications,
        loading,
        getPatientRequests,
        refreshData: fetchPatientData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};