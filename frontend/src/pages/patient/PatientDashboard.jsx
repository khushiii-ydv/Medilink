import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { User, Phone, ShieldCheck, Calendar } from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { patientProfile, loading } = useData();

  if (loading) {
    return <p>Loading patient dashboard...</p>;
  }

  const profile = patientProfile || user?.profile;

  return (
    <div>
      <div className="dashboard-page-header">
        <h1>Hello, {profile?.name || "Patient"}!</h1>
        <p>Welcome to your MediLink dashboard</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <User size={20} />
            <h3>Full Name</h3>
          </div>
          <p>{profile?.name || "N/A"}</p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <Phone size={20} />
            <h3>Phone Number</h3>
          </div>
          <p>{profile?.phoneNumber || user?.phone || "N/A"}</p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <ShieldCheck size={20} />
            <h3>Role</h3>
          </div>
          <p>{user?.role || "patient"}</p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <Calendar size={20} />
            <h3>Account Created</h3>
          </div>
          <p>
            {profile?.user?.createdAt
              ? new Date(profile.user.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}