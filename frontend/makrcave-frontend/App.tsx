import "./global.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MakerspaceProvider } from "./contexts/MakerspaceContext";
import { FeatureFlagProvider } from "./contexts/FeatureFlagContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Equipment from "./pages/Equipment";
import Projects from "./pages/Projects";
import Reservations from "./pages/Reservations";
import AdminUsers from "./pages/admin/Users";
import AdminMakerspace from "./pages/admin/Makerspace";
import AdminFeatureFlags from "./pages/admin/FeatureFlags";
import Login from "./pages/Login";
import { createRoot } from "react-dom/client";

const App = () => (
  <AuthProvider>
    <FeatureFlagProvider>
      <MakerspaceProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/portal/dashboard" replace />} />
            <Route path="portal">
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="equipment" element={<Equipment />} />
              <Route path="projects" element={<Projects />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="admin">
                <Route path="users" element={<AdminUsers />} />
                <Route path="makerspace" element={<AdminMakerspace />} />
              </Route>
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </MakerspaceProvider>
    </FeatureFlagProvider>
  </AuthProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
