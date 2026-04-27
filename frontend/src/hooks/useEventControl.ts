import { useState } from "react";
import { Event, Broadcast } from "../types";
import { useNotification } from "../contexts/NotificationContext";

export const useEventControl = (event: Event) => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'roster' | 'sessions' | 'broadcasts'>('roster');
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([
    { id: "1", eventId: event.id, message: "Welcome all! The opening ceremony starts in 30 mins.", timestamp: "10:30 AM", type: 'info' },
    { id: "2", eventId: event.id, message: "Urgent: Session A moved to Room 402.", timestamp: "11:15 AM", type: 'alert' }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendBroadcast = () => {
    if (!newMessage) {
      showNotification('error', 'Please enter a message.');
      return;
    }
    const newBroadcast: Broadcast = {
      id: Date.now().toString(),
      eventId: event.id,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'info'
    };
    setBroadcasts([newBroadcast, ...broadcasts]);
    setNewMessage("");
    showNotification('success', 'Message sent to everyone.');
  };

  const handleDecommission = () => {
    if (confirm("Initiate decommissioning sequence for this event node?")) {
      showNotification('info', 'Event cancelled.');
    }
  };

  const handleUpdateSchema = () => {
    showNotification('success', 'Changes saved.');
  };

  return {
    activeTab,
    setActiveTab,
    broadcasts,
    newMessage,
    setNewMessage,
    handleSendBroadcast,
    handleDecommission,
    handleUpdateSchema
  };
};
