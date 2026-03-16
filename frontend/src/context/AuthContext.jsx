import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("medilink_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("medilink_token");
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("medilink_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("medilink_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("medilink_token", token);
    } else {
      localStorage.removeItem("medilink_token");
    }
  }, [token]);

  const login = async (phone, password) => {
    try {
      const response = await authAPI.login({
        phone_number: phone,
        password,
      });

      const { token: authToken, user: userData } = response.data.data;

      const roleMap = {
        PATIENT: "patient",
        HOSPITAL_ADMIN: "hospital",
        AMBULANCE_DRIVER: "ambulance",
      };

      const mappedUser = {
        id: userData.user_id,
        phone: userData.phone_number,
        role: roleMap[userData.role] || userData.role?.toLowerCase(),
        profile: userData.profile || null,
        name:
          userData.profile?.name ||
          userData.profile?.driverName ||
          userData.profile?.hospital_name ||
          userData.profile?.name ||
          "",
        patientId: userData.profile?.id || null,
        hospitalId: userData.profile?.id || null,
        ambulanceId: userData.profile?.id || null,
      };

      setUser(mappedUser);
      setToken(authToken);

      toast.success("Login successful!");
      return { success: true, user: mappedUser };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (role, data) => {
    try {
      if (role === "patient") {
        await authAPI.registerPatient({
          name: data.name,
          phone_number: data.phone,
          password: data.password,
        });
      } else if (role === "hospital") {
        await authAPI.registerHospital({
          hospital_name: data.name,
          admin_phone_number: data.phone,
          password: data.password,
          address: data.address,
          contact_number: data.phone,
          email: data.email || null,
        });
      } else if (role === "ambulance") {
        await authAPI.registerAmbulance({
          driver_name: data.name,
          phone_number: data.phone,
          password: data.password,
          ambulance_number: data.vehicleNo,
          hospital_id: data.hospitalId,
        });
      }

      toast.success("Registration successful! Please login.");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("medilink_user");
    localStorage.removeItem("medilink_token");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};