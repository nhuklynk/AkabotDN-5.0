"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ResourceFormDialog from "./component/resource-form-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ResourceTable from "./component/resource-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Download,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";
import { useMediaList } from "@/hooks/admin/media/useMediaList";
import { useCreateMedia } from "@/hooks/admin/media/useCreateMedia";
import { useUpdateMedia } from "@/hooks/admin/media/useUpdateMedia";
import { useDeleteMedia } from "@/hooks/admin/media/useDeleteMedia";

type Resource = {
  id: string | number;
  filename: string;
  media_type: string;
  size: string;
  createdAt: string;
  url: string;
};

export default function ResourcesPage() {
  const { t } = useLocale();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    file: null as File | null,
    filename: "",
    media_type: "other" as "post" | "event" | "member" | "other",
  });

  const { items, total, setQuery, refetch } = useMediaList({
    initialQuery: { page: 1, limit: 10 },
  });
  const apiResources: Resource[] = useMemo(
    () =>
      items.map((m) => ({
        id: m.id,
        filename: m.file_name,
        media_type: m.media_type,
        size: `${Math.round((m.file_size || 0) / 1024)} KB`,
        createdAt: m.created_at || "",
        url: m.file_path,
      })),
    [items]
  );

  useEffect(() => {
    setResources(apiResources);
  }, [apiResources]);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.filename
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || resource.media_type === filterType;
    return matchesSearch && matchesType;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(
    1,
    Math.ceil((total || filteredResources.length) / pageSize)
  );
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const { mutate: createMedia } = useCreateMedia();
  const { mutate: updateMedia } = useUpdateMedia();
  const { mutate: deleteMedia } = useDeleteMedia();

  const handleCreateResource = async () => {
    if (!formData.file) return;
    try {
      await createMedia({
        file: formData.file,
        file_name: formData.filename || formData.file.name,
        media_type: formData.media_type,
      });
      setFormData({ file: null, filename: "", media_type: "other" });
      refetch();
    } catch (error) {
      console.error("Failed to create resource:", error);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      file: null,
      filename: resource.filename,
      media_type: (resource.media_type as any) || "other",
    });
    setDialogMode("edit");
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleUpdateResource = async () => {
    if (!editingResource) return;
    try {
      await updateMedia(editingResource.id, {
        file_name: formData.filename,
        media_type: formData.media_type,
      });
      setEditingResource(null);
      setFormData({ file: null, filename: "", media_type: "other" });
      refetch();
    } catch (error) {
      console.error("Failed to update resource:", error);
    }
  };

  const handleDeleteResource = async (resourceId: any) => {
    await deleteMedia(resourceId);
    refetch();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <Archive className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-chart-1 text-white";
      case "video":
        return "bg-chart-2 text-white";
      case "audio":
        return "bg-chart-3 text-white";
      case "document":
        return "bg-chart-4 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">
            {t("resource.title")}
          </h1>
          <p className="text-muted-foreground">{t("resource.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setDialogMode("create");
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("resource.add")}
        </Button>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingResource(null);
              setFormData({ file: null, filename: "", media_type: "other" });
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create"
                  ? t("resource.dialog.createTitle")
                  : t("resource.dialog.editTitle")}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? t("resource.dialog.createDesc")
                  : t("resource.dialog.editDesc")}
              </DialogDescription>
            </DialogHeader>

            <ResourceFormDialog
              formData={formData}
              setFormData={setFormData}
              mode={dialogMode}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={
                  dialogMode === "create"
                    ? handleCreateResource
                    : handleUpdateResource
                }
              >
                {dialogMode === "create"
                  ? t("resource.dialog.createCta")
                  : t("resource.dialog.updateCta")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("resource.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {t("resource.countSummary", {
                filtered: filteredResources.length,
                total: resources.length,
              })}
            </div>
          </div>

          <ResourceTable
            items={paginatedResources as any}
            getTypeColor={(t) => getTypeColor(t)}
            getTypeIcon={(t) => getTypeIcon(t)}
            getCategoryColor={() => "bg-muted text-muted-foreground"}
            onEdit={handleEditResource as any}
            onDelete={handleDeleteResource}
          />
          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Single dialog instance above handles both create and edit */}
    </div>
  );
}
