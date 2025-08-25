"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { useLocale } from "@/hooks/useLocale";

export type EventFormData = {
  id?: number;
  title: string;
  content: string;
  location: string;
  startAt: string; // ISO string or yyyy-MM-ddTHH:mm for input
  endAt?: string;
  enableCountdown: boolean;
  status: "active" | "inactive";
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  onSubmit: () => void;
  mode: "create" | "edit";
};

export default function EventFormDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  mode,
}: Props) {
  const isCreate = mode === "create";
  const { t } = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? t("event.dialog.createTitle") : t("event.dialog.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {isCreate ? t("event.dialog.createDesc") : t("event.dialog.editDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))}
              placeholder="Nhập tiêu đề sự kiện"
            />
          </div>

          <div>
            <Label htmlFor="startAt">Thời gian bắt đầu</Label>
            <Input
              id="startAt"
              type="datetime-local"
              value={formData.startAt}
              onChange={(e) => setFormData((d) => ({ ...d, startAt: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="endAt">Thời gian kết thúc (tuỳ chọn)</Label>
            <Input
              id="endAt"
              type="datetime-local"
              value={formData.endAt || ""}
              onChange={(e) => setFormData((d) => ({ ...d, endAt: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="location">Địa điểm</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((d) => ({ ...d, location: e.target.value }))}
              placeholder="Ví dụ: Hội trường A, 123 Đường ABC"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Nội dung</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(html) => setFormData((d) => ({ ...d, content: html }))}
            />
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <Checkbox
              checked={formData.enableCountdown}
              onCheckedChange={(checked) => setFormData((d) => ({ ...d, enableCountdown: !!checked }))}
              id="enableCountdown"
            />
            <Label htmlFor="enableCountdown">Bật đếm ngược đến thời điểm bắt đầu</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSubmit}>{isCreate ? t("event.dialog.createCta") : t("event.dialog.updateCta")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


