"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EventFormDialog, { EventFormData } from "./component/event-form-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventTable, { EventItem } from "./component/event-table";
import { Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";
import { useEvents } from "@/hooks/admin/event/useEvents";
import { CreateEventPayload, UpdateEventPayload } from "@/services/admin/events";

// Removed mock data - using API data instead

export default function EventManagementPage() {
  const { t } = useLocale();
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

  const events: EventItem[] = useMemo(() => {
    return apiEvents.map((event) => ({
      id: Number(event.id),
      title: event.title,
      content: event.description,
      location: event.location,
      startAt: event.start_time,
      endAt: event.end_time,
      enableCountdown: event.countdown_enabled,
      status: event.status as "active" | "inactive",
      createdAt: event.created_at,
    }));
  }, [apiEvents]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return events.filter((e) =>
      [e.title, e.location, e.content].some((v) => (v || "").toLowerCase().includes(term))
    );
  }, [events, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle search
  useEffect(() => {
    setQuery({
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
    });
  }, [currentPage, pageSize, searchTerm, setQuery]);

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

  const openCreate = () => {
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
  };

  const handleCreate = async () => {
    try {
      const payload: CreateEventPayload = {
        title: formData.title,
        content: formData.content,
        location: formData.location,
        start_time: new Date(formData.startAt).toISOString(),
        end_time: formData.endAt ? new Date(formData.endAt).toISOString() : undefined,
        countdown_enabled: formData.enableCountdown,
        status: formData.status,
      };
      await create(payload);
      setDialogOpen(false);
      setFormData({
        title: "", content: "", location: "", startAt: "", endAt: "",
        enableCountdown: false, status: "active"
      });
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const openEdit = (e: EventItem) => {
    setEditingEvent(e);
    setFormData({
      title: e.title,
      content: e.content,
      location: e.location,
      startAt: toDateTimeLocal(e.startAt),
      endAt: toDateTimeLocal(e.endAt),
      enableCountdown: e.enableCountdown,
      status: e.status,
    });
    setDialogMode("edit");
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleUpdate = async () => {
    if (!editingEvent) return;
    try {
      const payload: UpdateEventPayload = {
        title: formData.title,
        content: formData.content,
        location: formData.location,
        start_time: new Date(formData.startAt).toISOString(),
        end_time: formData.endAt ? new Date(formData.endAt).toISOString() : undefined,
        countdown_enabled: formData.enableCountdown,
        status: formData.status,
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
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove(id);
    } catch (error) {
      console.error("Delete failed:", error);
      throw error; // Re-throw to let DeleteConfirmDialog handle it
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">{t("event.title")}</h1>
          <p className="text-muted-foreground">{t("event.subtitle")}</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" /> {t("event.add")}
        </Button>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingEvent(null);
              setFormData({
                title: "", content: "", location: "", startAt: "", endAt: "",
                enableCountdown: false, status: "active"
              });
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? t("event.dialog.createTitle") : t("event.dialog.editTitle")}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create" ? t("event.dialog.createDesc") : t("event.dialog.editDesc")}
              </DialogDescription>
            </DialogHeader>

            <EventFormDialog formData={formData} setFormData={setFormData} mode={dialogMode} />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={dialogMode === "create" ? handleCreate : handleUpdate}>
                {dialogMode === "create" ? t("event.dialog.createCta") : t("event.dialog.updateCta")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("event.searchPlaceholder")}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            </div>
          ) : (
            <EventTable items={paginated} onEdit={openEdit} onDelete={handleDelete} />
          )}

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Single dialog instance above handles both create and edit */}
    </div>
  );
}


