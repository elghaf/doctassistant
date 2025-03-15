import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { TempoDevtools } from "tempo-devtools";
import { setupDemoData } from "./lib/setupDemoData";

// Initialize Tempo Devtools
TempoDevtools.init();

// Set up demo data for development
if (import.meta.env.DEV) {
  setupDemoData()
    .then((result) => {
      console.log("Demo data setup result:", result);
    })
    .catch((error) => {
      console.error("Failed to set up demo data:", error);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
