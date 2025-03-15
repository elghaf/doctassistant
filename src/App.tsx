import React from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import routes from "tempo-routes";

// Doctor components
import DoctorLayout from "@/components/doctor/DoctorLayout";
import DoctorHome from "@/components/doctor/DoctorHome";
import DoctorAppointments from "@/components/doctor/DoctorAppointments";
import DoctorPatients from "@/components/doctor/DoctorPatients";
import DoctorReports from "@/components/doctor/DoctorReports";

// Patient components
import PatientLayout from "@/components/patient/PatientLayout";
import PatientHome from "@/components/patient/PatientHome";
import PatientAppointments from "@/components/patient/PatientAppointments";
import PatientQuestionnaires from "@/components/patient/PatientQuestionnaires";
import PatientReports from "@/components/patient/PatientReports";

function App() {
  return (
    <>
      {/* Tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Doctor Routes */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DoctorHome />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="reports" element={<DoctorReports />} />
        </Route>

        {/* Patient Routes */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientHome />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="questionnaires" element={<PatientQuestionnaires />} />
          <Route path="reports" element={<PatientReports />} />
        </Route>

        {/* Legacy routes for backward compatibility */}
        <Route
          path="/patient-dashboard"
          element={<Navigate to="/patient" replace />}
        />
        <Route
          path="/doctor-dashboard"
          element={<Navigate to="/doctor" replace />}
        />
        <Route path="/dashboard/*" element={<DashboardRouter />} />

        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO && (
          <Route path="/tempobook/*" element={<></>} />
        )}
      </Routes>
    </>
  );
}

// Legacy dashboard router for backward compatibility
const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === "doctor") {
    return <Navigate to="/doctor" replace />;
  } else {
    return <Navigate to="/patient" replace />;
  }
};

export default App;
