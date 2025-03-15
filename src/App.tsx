import React from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import Login from "@/pages/Login";
import DoctorDashboardPage from "@/pages/DoctorDashboardPage";
import PatientDashboardPage from "@/pages/PatientDashboardPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import DoctorDashboard from "@/components/dashboard/DoctorDashboard";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import routes from "tempo-routes";

function App() {
  return (
    <>
      {/* Tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient-dashboard" element={<PatientDashboardPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO && (
          <Route path="/tempobook/*" element={<></>} />
        )}
      </Routes>
    </>
  );
}

const DashboardRouter = () => {
  const { user } = useAuth();

  return user?.role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />;
};

export default App;
