"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Trash2, Timer } from "lucide-react";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import React from "react";

export type EventItem = {
  id: number;
  title: string;
  content: string;
  location: string;
  startAt: string; // ISO or yyyy-MM-ddTHH:mm
  endAt?: string;
  enableCountdown: boolean;
  status: "active" | "inactive";
  createdAt: string;
};

function formatDateTime(value?: string) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  } catch {
    return value;
  }
}

function getCountdownText(startAt: string) {
  const now = new Date();
  const start = new Date(startAt);
  const diffMs = start.getTime() - now.getTime();
  if (Number.isNaN(start.getTime())) return "-";
  if (diffMs <= 0) return "Đã bắt đầu";
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function EventTable({
  items,
  onEdit,
  onDelete,
}: {
  items: EventItem[];
  onEdit: (event: EventItem) => void;
  onDelete: (id: number) => void;
}) {
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      forceRender();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Bắt đầu</TableHead>
            <TableHead>Kết thúc</TableHead>
            <TableHead>Địa điểm</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Đếm ngược</TableHead>
            <TableHead>Tạo lúc</TableHead>
            <TableHead className="w-[90px] whitespace-nowrap">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.title}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{formatDateTime(event.startAt)}</TableCell>
              <TableCell className="font-mono text-sm">{formatDateTime(event.endAt)}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Badge className={event.status === "active" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}>
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell>
                {event.enableCountdown ? (
                  <span className="inline-flex items-center gap-1 text-sm text-foreground">
                    <Timer className="h-4 w-4" /> {getCountdownText(event.startAt)}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>{event.createdAt}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(event)}>
                      <Edit className="h-4 w-4 mr-2" /> Sửa
                    </DropdownMenuItem>
                    <DeleteConfirmDialog
                      description="Thao tác này không thể hoàn tác. Sự kiện sẽ bị xóa vĩnh viễn."
                      onConfirm={() => onDelete(event.id)}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" /> Xóa
                      </DropdownMenuItem>
                    </DeleteConfirmDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


