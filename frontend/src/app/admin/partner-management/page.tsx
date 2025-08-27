"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import PartnerFormDialog from "./component/partner-form-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PartnerTable from "./component/partner-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Crown,
  Medal,
  Award,
  Trophy,
  Users,
} from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";
import { usePartnerList } from "@/hooks/admin/partner/usePartnerList";
import { useCreatePartner } from "@/hooks/admin/partner/useCreatePartner";
import { useUpdatePartner } from "@/hooks/admin/partner/useUpdatePartner";
import { useDeletePartner } from "@/hooks/admin/partner/useDeletePartner";
import { validatePartnerForm, isPartnerFormValid } from "./component/partner-form-dialog";

type Partner = {
  id: string | number;
  name: string;
  description?: string;
  logo?: string;
  logo_url?: string | null;
  website?: string;
  partner_type: "strategic" | "gold" | "silver" | "bronze" | "associate";
  sort_order: number;
  status: string;
  created_at?: string;
  modified_at?: string;
  created_by?: string;
  modified_by?: string;
};

export default function PartnersPage() {
  const { t } = useLocale();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null as File | null,
    website: "",
    partner_type: "gold" as "strategic" | "gold" | "silver" | "bronze" | "associate",
    sort_order: 0,
  });

  const { items, total, setQuery, refetch } = usePartnerList({
    initialQuery: { page: 1, limit: 10 },
  });

  const apiPartners: Partner[] = useMemo(
    () =>
      items
        .filter((p) => p.status === "active") // Only show active items
        .map((p) => ({
          id: p.id,
          name: p.name || "",
          description: p.description || "",
          logo: p.logo,
          logo_url: p.logo_url,
          website: p.website || "",
          partner_type: p.partner_type,
          sort_order: p.sort_order || 0,
          status: p.status,
          created_at: p.created_at || "",
          modified_at: p.modified_at || "",
          created_by: p.created_by || "",
          modified_by: p.modified_by || "",
        })),
    [items]
  );

  useEffect(() => {
    setPartners(apiPartners);
  }, [apiPartners]);

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || partner.partner_type === filterType;
    return matchesSearch && matchesType;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(
    1,
    Math.ceil((total || filteredPartners.length) / pageSize)
  );
  const paginatedPartners = filteredPartners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const { mutate: createPartner } = useCreatePartner();
  const { mutate: updatePartner } = useUpdatePartner();
  const { mutate: deletePartner } = useDeletePartner();

  const handleCreatePartner = async () => {
    try {
      await createPartner({
        name: formData.name,
        description: formData.description || undefined,
        logo: formData.logo || undefined,
        website: formData.website || undefined,
        partner_type: formData.partner_type,
        sort_order: formData.sort_order,
      });
      setFormData({ 
        name: "", 
        description: "", 
        logo: null, 
        website: "", 
        partner_type: "gold", 
        sort_order: 0 
      });
      setIsFormValid(false);
      setDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to create partner:", error);
    }
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      description: partner.description || "",
      logo: null, // Don't pre-fill file input
      website: partner.website || "",
      partner_type: partner.partner_type,
      sort_order: partner.sort_order,
    });
    setDialogMode("edit");
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleUpdatePartner = async () => {
    if (!editingPartner) return;

    try {
      const updatePayload: any = {};
      
      if (formData.name) updatePayload.name = formData.name;
      if (formData.description) updatePayload.description = formData.description;
      if (formData.website) updatePayload.website = formData.website;
      if (formData.partner_type) updatePayload.partner_type = formData.partner_type;
      if (formData.sort_order !== undefined) updatePayload.sort_order = formData.sort_order;
      if (formData.logo) updatePayload.logo = formData.logo;

      await updatePartner(editingPartner.id, updatePayload);
      setEditingPartner(null);
      setFormData({ 
        name: "", 
        description: "", 
        logo: null, 
        website: "", 
        partner_type: "gold", 
        sort_order: 0 
      });
      setIsFormValid(false);
      setDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to update partner:", error);
    }
  };

  const handleDeletePartner = async (partnerId: any) => {
    try {
      await deletePartner(partnerId);
      refetch();
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case "strategic":
        return <Crown className="h-4 w-4" />;
      case "gold":
        return <Medal className="h-4 w-4" />;
      case "silver":
        return <Award className="h-4 w-4" />;
      case "bronze":
        return <Trophy className="h-4 w-4" />;
      case "associate":
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getPartnerTypeColor = (type: string) => {
    switch (type) {
      case "strategic":
        return "bg-purple-500 text-white";
      case "gold":
        return "bg-yellow-500 text-white";
      case "silver":
        return "bg-gray-400 text-white";
      case "bronze":
        return "bg-orange-600 text-white";
      case "associate":
        return "bg-blue-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">
            {t("partner.title")}
          </h1>
          <p className="text-muted-foreground">{t("partner.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setDialogMode("create");
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("partner.add")}
        </Button>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingPartner(null);
              setFormData({ 
                name: "", 
                description: "", 
                logo: null, 
                website: "", 
                partner_type: "gold", 
                sort_order: 0 
              });
              setIsFormValid(false);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create"
                  ? t("partner.dialog.createTitle")
                  : t("partner.dialog.editTitle")}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? t("partner.dialog.createDesc")
                  : t("partner.dialog.editDesc")}
              </DialogDescription>
            </DialogHeader>

            <PartnerFormDialog
              formData={formData}
              setFormData={setFormData}
              mode={dialogMode}
              onValidationChange={setIsFormValid}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={
                  dialogMode === "create"
                    ? handleCreatePartner
                    : handleUpdatePartner
                }
                disabled={!isFormValid}
                className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
              >
                {dialogMode === "create"
                  ? t("partner.dialog.createCta")
                  : t("partner.dialog.updateCta")}
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
                placeholder={t("partner.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("partner.filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("partner.all")}</SelectItem>
                <SelectItem value="strategic">{t("partner.types.strategic")}</SelectItem>
                <SelectItem value="gold">{t("partner.types.gold")}</SelectItem>
                <SelectItem value="silver">{t("partner.types.silver")}</SelectItem>
                <SelectItem value="bronze">{t("partner.types.bronze")}</SelectItem>
                <SelectItem value="associate">{t("partner.types.associate")}</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {t("partner.countSummary", {
                filtered: filteredPartners.length,
                total: partners.length,
              })}
            </div>
          </div>

          <PartnerTable
            items={paginatedPartners as any}
            getPartnerTypeColor={(t) => getPartnerTypeColor(t)}
            getPartnerTypeIcon={(t) => getPartnerTypeIcon(t)}
            onEdit={handleEditPartner as any}
            onDelete={handleDeletePartner}
          />
          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
