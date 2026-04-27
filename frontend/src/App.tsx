/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProfile } from "./types";
import { NotificationProvider } from "./contexts/NotificationContext";

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user}>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user}>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
}


export default App;
