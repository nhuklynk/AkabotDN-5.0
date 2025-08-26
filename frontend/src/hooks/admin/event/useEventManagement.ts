import { useState, useCallback } from "react";
import { useEvents } from "./useEvents";
import { CreateEventPayload, UpdateEventPayload } from "@/services/admin/events";
import type { EventItem } from "@/app/admin/event-management/component/event-table";

export type EventFormData = {
  title: string;
  content: string;
  location: string;
  startAt: string;
  endAt: string;
  enableCountdown: boolean;
  status: "active" | "inactive";
};

export function useEventManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    content: "",
    location: "",
    startAt: "",
    endAt: "",
    enableCountdown: true,
    status: "active",
  });

  const { items: apiEvents, loading, error, create, update, remove, setQuery } = useEvents({
    initialQuery: { page: 1, limit: 10 }
  });

  // Map API events to EventItem format
  const events: EventItem[] = apiEvents.map((event) => ({
    id: Number(event.id),
    title: event.title,
    content: event.content,
    location: event.location,
    startAt: event.start_time,
    endAt: event.end_time,
    enableCountdown: event.countdown_enabled,
    status: event.public_status as "active" | "inactive",
    createdAt: event.created_at,
  }));

  const toDateTimeLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const pad = (n: number) => `${n}`.padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const openCreate = useCallback(() => {
    setFormData({
      title: "",
      content: "",
      location: "",
      startAt: toDateTimeLocal(new Date().toISOString()),
      endAt: "",
      enableCountdown: true,
      status: "active",
    });
    setDialogMode("create");
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((event: EventItem) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      content: event.content,
      location: event.location,
      startAt: toDateTimeLocal(event.startAt),
      endAt: toDateTimeLocal(event.endAt),
      enableCountdown: event.enableCountdown,
      status: event.status,
    });
    setDialogMode("edit");
    setDialogOpen(true);
  }, []);

  const handleCreate = useCallback(async () => {
    try {
      const payload: CreateEventPayload = {
        title: formData.title,
        content: formData.content,
        location: formData.location,
        start_time: new Date(formData.startAt).toISOString(),
        end_time: formData.endAt ? new Date(formData.endAt).toISOString() : undefined,
        countdown_enabled: formData.enableCountdown,
        public_status: formData.status,
      };
      await create(payload);
      setDialogOpen(false);
      setFormData({
        title: "", content: "", location: "", startAt: "", endAt: "",
        enableCountdown: false, status: "active"
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
    }
  }, [formData, create]);

  const handleUpdate = useCallback(async () => {
    if (!editingEvent) return;
    try {
      const payload: UpdateEventPayload = {
        title: formData.title,
        content: formData.content,
        location: formData.location,
        start_time: new Date(formData.startAt).toISOString(),
        end_time: formData.endAt ? new Date(formData.endAt).toISOString() : undefined,
        countdown_enabled: formData.enableCountdown,
        public_status: formData.status,
      };
      await update(editingEvent.id, payload);
      setDialogOpen(false);
      setEditingEvent(null);
      setFormData({
        title: "", content: "", location: "", startAt: "", endAt: "",
        enableCountdown: false, status: "active"
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      throw error;
    }
  }, [formData, editingEvent, update]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await remove(id);
    } catch (error) {
      console.error("Delete failed:", error);
      throw error;
    }
  }, [remove]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setQuery({
      page: 1,
      limit: 10,
      search: term || undefined,
    });
  }, [setQuery]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingEvent(null);
    setFormData({
      title: "", content: "", location: "", startAt: "", endAt: "",
      enableCountdown: false, status: "active"
    });
  }, []);

  return {
    // State
    events,
    searchTerm,
    dialogOpen,
    dialogMode,
    editingEvent,
    formData,
    loading,
    error,
    
    // Actions
    setFormData,
    setSearchTerm,
    setDialogOpen,
    openCreate,
    openEdit,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSearch,
    closeDialog,
  };
}

export default useEventManagement;
