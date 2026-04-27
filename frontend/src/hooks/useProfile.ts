import { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { useNotification } from "../contexts/NotificationContext";
import { api } from "../services/api";

export const useProfile = () => {
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : {
      uid: "123",
      name: "Loading...",
      email: "",
      college: "",
      department: "",
      mobile: "",
      interests: [],
      role: "participant",
      assignedSubEventIds: [],
      imageUrl: ""
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        if (data && !data.message) {
          setProfile(data);
          setTempProfile(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const result = await api.saveProfile(tempProfile);
      if (result.success || !result.message) {
        setProfile(tempProfile);
        localStorage.setItem("user", JSON.stringify(tempProfile));
        setIsEditing(false);
        showNotification('success', 'Profile updated successfully.');
      } else {
        showNotification('error', result.message || 'Update failed.');
      }
    } catch (err) {
      console.error("Profile update failed", err);
      showNotification('error', 'Could not update profile.');
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showNotification('info', 'Uploading identity image...');
        const resp = await api.uploadPhoto(file);
        if (resp.url) {
          setTempProfile({ ...tempProfile, imageUrl: resp.url });
          showNotification('success', 'Image uploaded.');
        } else {
          showNotification('error', resp.message || 'Upload failed.');
        }
      } catch (err) {
        showNotification('error', 'Upload failed.');
      }
    }
  };

  const addInterest = () => {
    if (newInterest && !tempProfile.interests.includes(newInterest)) {
      setTempProfile({ ...tempProfile, interests: [...tempProfile.interests, newInterest] });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setTempProfile({ ...tempProfile, interests: tempProfile.interests.filter(i => i !== interest) });
  };

  return {
    profile,
    isEditing,
    setIsEditing,
    tempProfile,
    setTempProfile,
    newInterest,
    setNewInterest,
    handleSave,
    handlePhotoChange,
    addInterest,
    removeInterest
  };
};
