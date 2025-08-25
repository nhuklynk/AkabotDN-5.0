"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ResourceFormDialog from "./component/resource-form-dialog";
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
  name: string;
  filename: string;
  type: string;
  size: string;
  category: string;
  description: string;
  uploadedBy: string;
  createdAt: string;
  url: string;
};

export default function ResourcesPage() {
  const { t } = useLocale();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    filename: "",
    type: "document",
    category: "general",
    description: "",
  });

  const { items, total, setQuery, refetch } = useMediaList({
    initialQuery: { page: 1, limit: 10 },
  });
  const apiResources: Resource[] = useMemo(
    () =>
      items.map((m) => ({
        id: m.id,
        name: m.file_name,
        filename: m.file_name,
        type: m.media_type,
        size: `${Math.round((m.file_size || 0) / 1024)} KB`,
        category: "general",
        description: "",
        uploadedBy: "",
        createdAt: m.created_at || "",
        url: m.file_path,
      })),
    [items]
  );

  useEffect(() => {
    setResources(apiResources);
  }, [apiResources]);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || resource.type === filterType;
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
    await createMedia({
      file: new Blob(["placeholder"], { type: "text/plain" }),
      file_name: formData.filename,
      media_type: "other",
    });
    setFormData({
      name: "",
      filename: "",
      type: "document",
      category: "general",
      description: "",
    });
    setIsCreateDialogOpen(false);
    refetch();
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      filename: resource.filename,
      type: resource.type,
      category: resource.category,
      description: resource.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateResource = async () => {
    if (!editingResource) return;
    await updateMedia(editingResource.id, {
      file_name: formData.filename,
      media_type: "other",
    });
    setIsEditDialogOpen(false);
    setEditingResource(null);
    setFormData({
      name: "",
      filename: "",
      type: "document",
      category: "general",
      description: "",
    });
    refetch();
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "branding":
        return "bg-primary text-primary-foreground";
      case "marketing":
        return "bg-chart-5 text-white";
      case "documentation":
        return "bg-secondary text-secondary-foreground";
      case "media":
        return "bg-accent text-accent-foreground";
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
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          {t("resource.add")}
        </Button>
        <ResourceFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateResource}
          mode="create"
        />
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
                <SelectValue placeholder={t("resource.filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("resource.all")}</SelectItem>
                <SelectItem value="document">
                  {t("resource.types.document")}
                </SelectItem>
                <SelectItem value="image">
                  {t("resource.types.image")}
                </SelectItem>
                <SelectItem value="video">
                  {t("resource.types.video")}
                </SelectItem>
                <SelectItem value="audio">
                  {t("resource.types.audio")}
                </SelectItem>
                <SelectItem value="archive">
                  {t("resource.types.archive")}
                </SelectItem>
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
            items={paginatedResources}
            getTypeColor={getTypeColor}
            getTypeIcon={getTypeIcon}
            getCategoryColor={getCategoryColor}
            onEdit={handleEditResource}
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

      <ResourceFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateResource}
        mode="edit"
      />
    </div>
  );
}
