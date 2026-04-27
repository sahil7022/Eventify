import { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { useNotification } from "../contexts/NotificationContext";
import { firebaseService } from "../services/firebaseService";

export const useProfile = () => {
  const { showNotification } = useNotification();
  const [user] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

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
      if (!user?.id) return;
      try {
        const data = await firebaseService.getProfile(user.id);
        if (data) {
          setProfile(data as any);
          setTempProfile(data as any);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      await firebaseService.updateProfile(user.id, tempProfile);
      setProfile(tempProfile);
      localStorage.setItem("user", JSON.stringify(tempProfile));
      setIsEditing(false);
      showNotification('success', 'Profile updated successfully.');
    } catch (err) {
      console.error("Profile update failed", err);
      showNotification('error', 'Could not update profile.');
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Note: Photo upload with Firebase Storage would be here
    showNotification('info', 'Photo upload is currently manual for Firebase migration.');
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
