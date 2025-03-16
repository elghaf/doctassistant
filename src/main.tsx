import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import "./lib/tempo-devtools";
import { setupDemoData } from "./lib/setupDemoData";

// Initialize Tempo Devtools
// This will use the mock implementation from our local file
TempoDevtools.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Setup demo data if needed
setupDemoData().catch(console.error);
