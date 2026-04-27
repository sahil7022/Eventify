import { useState, useEffect } from "react";
import { SubEvent, RuleBook } from "../types";
import { OrganizerService } from "../services/organizerService";
import { useNotification } from "../contexts/NotificationContext";
import * as XLSX from 'xlsx';

export function useSubEventControl(subEvent: SubEvent) {
  const { showNotification } = useNotification();
  const [activePane, setActivePane] = useState<'details' | 'participants' | 'announcements' | 'rulebook'>('details');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [currentSubEvent, setCurrentSubEvent] = useState(subEvent);

  const [ruleBook, setRuleBook] = useState<RuleBook | null>(null);
  const [ruleBookLoading, setRuleBookLoading] = useState(false);
  const [isSavingRules, setIsSavingRules] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasSavedLocally, setHasSavedLocally] = useState(false);
  const [rulesDraft, setRulesDraft] = useState({
    rulesType: "text" as "text" | "file",
    rulesContent: "",
    fileUrl: "",
    fileName: ""
  });

  const [editForm, setEditForm] = useState({
    date: subEvent.date,
    time: subEvent.time,
    venue: subEvent.venue,
    rules: subEvent.rules || "",
    instructions: subEvent.instructions || ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (activePane === 'rulebook') {
      const loadRules = async () => {
        setRuleBookLoading(true);
        try {
          const data = await OrganizerService.getRuleBook(subEvent.id);
          setRuleBook(data);
          setRulesDraft({
            rulesType: data.rulesType,
            rulesContent: data.rulesContent || "",
            fileUrl: data.fileUrl || "",
            fileName: data.fileName || ""
          });
        } catch (err) {
          console.error("Failed to load rules", err);
          showNotification('error', 'Could not load rule book.');
        } finally {
          setRuleBookLoading(false);
        }
      };
      loadRules();
    }
  }, [activePane, subEvent.id, showNotification]);

  useEffect(() => {
    if (activePane === 'participants') {
      const loadParticipants = async () => {
        setParticipantsLoading(true);
        try {
          const data = await OrganizerService.getParticipants(subEvent.id);
          setParticipants(data);
        } catch (err) {
          console.error("Failed to load participants", err);
        } finally {
          setParticipantsLoading(false);
        }
      };
      loadParticipants();
    }
  }, [activePane, subEvent.id]);

  const handleSaveRules = async () => {
    setIsSavingRules(true);
    try {
      await OrganizerService.saveRuleBook(subEvent.id, rulesDraft);
      setRuleBook({ ...ruleBook!, ...rulesDraft, updatedAt: new Date().toISOString(), isPublished: ruleBook?.isPublished || false });
      setHasSavedLocally(true);
      showNotification('success', 'Rules saved.');
    } catch (err) {
      console.error("Save failed", err);
      showNotification('error', 'Could not save rules.');
    } finally {
      setIsSavingRules(false);
    }
  };

  const handlePublishRules = async () => {
    setIsPublishing(true);
    try {
      await OrganizerService.publishRuleBook(subEvent.id);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const publishMsg = `Rule Book has been updated for ${subEvent.name}. Tactical parameters are now live.`;
      await OrganizerService.postAnnouncement(subEvent.id, publishMsg, user);
      setRuleBook(prev => prev ? { ...prev, isPublished: true } : null);
      setHasSavedLocally(false);
      showNotification('success', 'Rule book published.');
    } catch (err) {
      showNotification('error', 'Could not publish rule book.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await OrganizerService.updateSubEvent(subEvent.id, editForm);
      setCurrentSubEvent({ ...currentSubEvent, ...editForm });
      setIsEditModalOpen(false);
      showNotification('success', 'Sub-event updated.');
    } catch (err) {
      showNotification('error', 'Failed to update sub-event.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadList = () => {
    if (participants.length === 0) return;
    const dataToExport = participants.map(p => ({
      "Registration ID": p.id,
      "Name": p.name,
      "Email": p.email,
      "Phone": p.phone,
      "Status": p.status
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(wb, `${subEvent.name}_Participants.xlsx`);
  };

  const handlePostAnnouncement = async () => {
    if (!message.trim()) return;
    setIsPosting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await OrganizerService.postAnnouncement(subEvent.id, message, user);
      setMessage("");
      showNotification('success', 'Announcement sent.');
    } catch (err) {
      showNotification('error', 'Failed to send announcement.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleUploadPoster = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const response = await OrganizerService.uploadSubEventPoster(subEvent.id, file);
      setCurrentSubEvent({
        ...currentSubEvent,
        posterUrl: response.posterUrl
      });
      showNotification('success', 'Sub-event poster updated.');
    } catch (err) {
      showNotification('error', 'Failed to upload poster.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return {
    activePane,
    setActivePane,
    isEditModalOpen,
    setIsEditModalOpen,
    participants,
    participantsLoading,
    ruleBook,
    ruleBookLoading,
    isSavingRules,
    isPublishing,
    hasSavedLocally,
    rulesDraft,
    setRulesDraft,
    editForm,
    setEditForm,
    isUpdating,
    message,
    setMessage,
    isPosting,
    isUploadingImage,
    currentSubEvent,
    handleSaveRules,
    handlePublishRules,
    handleUpdate,
    handleDownloadList,
    handlePostAnnouncement,
    handleUploadPoster
  };
}
