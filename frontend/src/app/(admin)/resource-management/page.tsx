"use client";

import { useEffect, useState } from "react";
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

const initialResources = [
  {
    id: 1,
    name: "Company Logo",
    filename: "company-logo.png",
    type: "image",
    size: "245 KB",
    category: "branding",
    description: "Main company logo in PNG format",
    uploadedBy: "John Doe",
    createdAt: "2024-01-15",
    url: "/generic-company-logo.png",
  },
  {
    id: 2,
    name: "User Manual",
    filename: "user-manual.pdf",
    type: "document",
    size: "2.1 MB",
    category: "documentation",
    description: "Complete user manual for the application",
    uploadedBy: "Jane Smith",
    createdAt: "2024-01-20",
    url: "#",
  },
  {
    id: 3,
    name: "Product Demo",
    filename: "product-demo.mp4",
    type: "video",
    size: "15.3 MB",
    category: "marketing",
    description: "Product demonstration video for marketing",
    uploadedBy: "Bob Johnson",
    createdAt: "2024-02-01",
    url: "#",
  },
  {
    id: 4,
    name: "Background Music",
    filename: "background-music.mp3",
    type: "audio",
    size: "4.2 MB",
    category: "media",
    description: "Background music for promotional videos",
    uploadedBy: "Alice Brown",
    createdAt: "2024-02-10",
    url: "#",
  },
];

type Resource = {
  id: number;
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
  const [resources, setResources] = useState<Resource[]>(initialResources);
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
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / pageSize));
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const handleCreateResource = () => {
    const newResource: Resource = {
      id: Math.max(...resources.map((r) => r.id)) + 1,
      ...formData,
      size: "1.2 MB", // Mock size
      uploadedBy: "Current User", // Mock user
      createdAt: new Date().toISOString().split("T")[0],
      url: "#", // Mock URL
    };
    setResources([...resources, newResource]);
    setFormData({
      name: "",
      filename: "",
      type: "document",
      category: "general",
      description: "",
    });
    setIsCreateDialogOpen(false);
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

  const handleUpdateResource = () => {
    if (editingResource) {
      setResources(
        resources.map((resource) =>
          resource.id === editingResource.id
            ? { ...resource, ...formData }
            : resource
        )
      );
      setIsEditDialogOpen(false);
      setEditingResource(null);
      setFormData({
        name: "",
        filename: "",
        type: "document",
        category: "general",
        description: "",
      });
    }
  };

  const handleDeleteResource = (resourceId: number) => {
    setResources(resources.filter((resource) => resource.id !== resourceId));
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
            Quản lý tài nguyên
          </h1>
          <p className="text-muted-foreground">
            Quản lý tài sản số, tệp tin và nội dung đa phương tiện.
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Thêm tài nguyên
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
                placeholder="Tìm kiếm tài nguyên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="document">Tài liệu</SelectItem>
                <SelectItem value="image">Hình ảnh</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Âm thanh</SelectItem>
                <SelectItem value="archive">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {filteredResources.length} / {resources.length} tài nguyên
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
