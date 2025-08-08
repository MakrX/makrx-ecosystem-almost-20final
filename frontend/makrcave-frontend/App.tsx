import "./global.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MakerspaceProvider } from "./contexts/MakerspaceContext";
import { FeatureFlagProvider } from "./contexts/FeatureFlagContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { MemberProvider } from "./contexts/MemberContext";
import { BillingProvider } from "./contexts/BillingContext";
import { SkillProvider } from "./contexts/SkillContext";
import { HealthProvider } from "./contexts/HealthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Equipment from "./pages/Equipment";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Reservations from "./pages/Reservations";
import Members from "./pages/Members";
import Billing from "./pages/Billing";
import Analytics from "./pages/Analytics";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import SkillManagement from "./pages/SkillManagement";
import NotificationsCenter from "./pages/NotificationsCenter";
import AdminUsers from "./pages/admin/Users";
import AdminMakerspace from "./pages/admin/Makerspace";
import AdminMakerspaces from "./pages/admin/Makerspaces";
import AdminFeatureFlags from "./pages/admin/FeatureFlags";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SystemHealth from "./pages/SystemHealth";
import ErrorLogs from "./pages/ErrorLogs";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { createRoot } from "react-dom/client";

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <FeatureFlagProvider>
          <MakerspaceProvider>
            <MemberProvider>
              <BillingProvider>
                <SkillProvider>
                  <HealthProvider
                    autoRefresh={true}
                    refreshInterval={60000}
                    enableNotifications={true}
                  >
                    <BrowserRouter>
                <Routes>
                  {/* Authentication Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/portal/dashboard" replace />} />
                    <Route path="portal">
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="inventory" element={<Inventory />} />
                      <Route path="equipment" element={<Equipment />} />
                      <Route path="projects" element={<Projects />} />
                      <Route path="projects/:projectId" element={<ProjectDetail />} />
                      <Route path="reservations" element={<Reservations />} />
                      <Route path="members" element={<Members />} />
                      <Route path="billing" element={<Billing />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="maintenance" element={<Maintenance />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="skills" element={<SkillManagement />} />
                      <Route path="notifications" element={<NotificationsCenter />} />
                      <Route path="system-health" element={
                        <ProtectedRoute
                          adminFeature="healthMonitoring"
                          allowedRoles={['super_admin', 'admin']}
                        >
                          <SystemHealth />
                        </ProtectedRoute>
                      } />
                      <Route path="makerspaces" element={<AdminMakerspaces />} />
                      <Route path="admin">
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="makerspace" element={<AdminMakerspace />} />
                        <Route path="feature-flags" element={<AdminFeatureFlags />} />
                        <Route path="error-logs" element={<ErrorLogs />} />
                      </Route>
                    </Route>
                  </Route>
                </Routes>
                    </BrowserRouter>
                  </HealthProvider>
                </SkillProvider>
              </BillingProvider>
            </MemberProvider>
          </MakerspaceProvider>
        </FeatureFlagProvider>
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
