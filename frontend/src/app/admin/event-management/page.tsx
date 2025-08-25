"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EventFormDialog, { EventFormData } from "./component/event-form-dialog";
import EventTable, { EventItem } from "./component/event-table";
import { Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";

const initialEvents: EventItem[] = [
  {
    id: 1,
    title: "Hội thảo Công nghệ 2025",
    content: "<p>Giới thiệu xu hướng công nghệ mới.</p>",
    location: "Hội trường A",
    startAt: new Date(Date.now() + 86400000).toISOString(),
    endAt: new Date(Date.now() + 2 * 86400000).toISOString(),
    enableCountdown: true,
    status: "active",
    createdAt: "2025-01-01",
  },
  {
    id: 2,
    title: "Hoạt động thiện nguyện",
    content: "<p>Chung tay vì cộng đồng.</p>",
    location: "Quận 1",
    startAt: new Date(Date.now() + 5 * 3600000).toISOString(),
    endAt: undefined,
    enableCountdown: false,
    status: "inactive",
    createdAt: "2025-01-02",
  },
];

export default function EventManagementPage() {
  const { t } = useLocale();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
    setIsCreateDialogOpen(true);
  };

  const handleCreate = () => {
    setEvents((prev) => [
      {
        id: prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1,
        title: formData.title,
        content: formData.content,
        location: formData.location,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: formData.endAt ? new Date(formData.endAt).toISOString() : undefined,
        enableCountdown: formData.enableCountdown,
        status: formData.status,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setIsCreateDialogOpen(false);
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
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingEvent) return;
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id !== editingEvent.id
          ? ev
          : {
              ...ev,
              title: formData.title,
              content: formData.content,
              location: formData.location,
              startAt: new Date(formData.startAt).toISOString(),
              endAt: formData.endAt ? new Date(formData.endAt).toISOString() : undefined,
              enableCountdown: formData.enableCountdown,
              status: formData.status,
            }
      )
    );
    setIsEditDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
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
        <EventFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          mode="create"
        />
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

          <EventTable items={paginated} onEdit={openEdit} onDelete={handleDelete} />

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      <EventFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdate}
        mode="edit"
      />
    </div>
  );
}


