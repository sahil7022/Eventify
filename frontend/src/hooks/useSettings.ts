import { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";

export const useSettings = () => {
  const { showNotification } = useNotification();
  const [profile] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : { name: "Guest", role: "participant" };
  });
  const [settings, setSettings] = useState({
    name: "Aditya Sharma",
    email: "aditya@univ.edu",
    phone: "+91 9876543210",
    notifications: {
      email: true,
      inApp: true,
      reminders: true
    },
    privacy: "public"
  });

  const handleToggle = (key: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handleSave = () => {
    showNotification('success', 'Changes saved.');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return {
    profile,
    settings,
    setSettings,
    handleToggle,
    handleSave,
    handleLogout
  };
};
