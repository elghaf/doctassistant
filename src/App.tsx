import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import DoctorDashboard from "@/pages/DoctorDashboardPage";
import PatientDashboard from "@/pages/PatientDashboardPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";


function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
