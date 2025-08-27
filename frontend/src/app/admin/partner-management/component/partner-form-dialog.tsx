"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLocale } from "@/hooks/useLocale"
import { AlertCircle } from "lucide-react"

type PartnerFormData = {
  name: string
  description: string
  logo: File | null
  website: string
  partner_type: "strategic" | "gold" | "silver" | "bronze" | "associate"
  sort_order: number
}

type ValidationErrors = {
  website?: string
  logo?: string
}

type Props = {
  formData: PartnerFormData
  setFormData: React.Dispatch<React.SetStateAction<PartnerFormData>>
  mode: "create" | "edit"
  onValidationChange?: (isValid: boolean) => void
}

// Export validation function for use in parent component
export const validatePartnerForm = (data: PartnerFormData, mode: "create" | "edit"): ValidationErrors => {
  const errors: ValidationErrors = {}

  // Validate website
  if (data.website.trim()) {
    try {
      const urlObj = new URL(data.website)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.website = "Website phải bắt đầu với http:// hoặc https://"
      }
    } catch {
      errors.website = "Định dạng website không hợp lệ. Ví dụ: https://example.com"
    }
  }

  // Validate logo
  if (mode === "create" && !data.logo) {
    errors.logo = "Logo là bắt buộc"
  } else if (data.logo) {
    if (!data.logo.type.startsWith('image/')) {
      errors.logo = "File phải là hình ảnh (JPG, PNG, GIF, etc.)"
    } else if (data.logo.size > 5 * 1024 * 1024) {
      errors.logo = "Kích thước file không được vượt quá 5MB"
    }
  }

  return errors
}

// Helper function to check if form is valid
export const isPartnerFormValid = (data: PartnerFormData, mode: "create" | "edit"): boolean => {
  const errors = validatePartnerForm(data, mode)
  return Object.keys(errors).length === 0 && data.name.trim().length > 0
}

export default function PartnerFormDialog({ formData, setFormData, mode, onValidationChange }: Props) {
  const { t } = useLocale()
  const [errors, setErrors] = React.useState<ValidationErrors>({})

  // Check validation whenever form data changes
  React.useEffect(() => {
    const isValid = isPartnerFormValid(formData, mode)
    onValidationChange?.(isValid)
  }, [formData, mode, onValidationChange])

  // Validation functions
  const validateWebsite = (url: string): string | undefined => {
    if (!url.trim()) return undefined // Optional field
    
    try {
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return "Website phải bắt đầu với http:// hoặc https://"
      }
    } catch {
      return "Định dạng website không hợp lệ. Ví dụ: https://example.com"
    }
    return undefined
  }

  const validateLogo = (file: File | null): string | undefined => {
    // Required for create mode
    if (mode === "create" && !file) {
      return "Logo là bắt buộc"
    }
    
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        return "File phải là hình ảnh (JPG, PNG, GIF, etc.)"
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        return "Kích thước file không được vượt quá 5MB"
      }
    }
    
    return undefined
  }

  // Handle website change with validation
  const handleWebsiteChange = (value: string) => {
    setFormData((d) => ({ ...d, website: value }))
    const error = validateWebsite(value)
    setErrors((prev) => ({ ...prev, website: error }))
  }

  // Handle logo change with validation
  const handleLogoChange = (file: File | null) => {
    setFormData((d) => ({ ...d, logo: file }))
    const error = validateLogo(file)
    setErrors((prev) => ({ ...prev, logo: error }))
  }

  // Error component
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
        <AlertCircle className="h-4 w-4" />
        <span>{message}</span>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">{t("partner.form.name")}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
          placeholder={t("partner.form.namePlaceholder")}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">{t("partner.form.description")}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
          placeholder={t("partner.form.descriptionPlaceholder")}
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="website">{t("partner.form.website")}</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => handleWebsiteChange(e.target.value)}
          placeholder={t("partner.form.websitePlaceholder")}
          className={errors.website ? "border-red-500 focus:border-red-500" : ""}
        />
        <ErrorMessage message={errors.website} />
      </div>
      
      <div>
        <Label htmlFor="logo">
          {t("partner.form.logo")}
          {mode === "create" && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null
            handleLogoChange(f)
          }}
          required={mode === "create"}
          className={errors.logo ? "border-red-500 focus:border-red-500" : ""}
        />
        {mode === "create" && (
          <p className="text-xs text-muted-foreground mt-1">
            File hình ảnh (JPG, PNG, GIF). Tối đa 5MB.
          </p>
        )}
        <ErrorMessage message={errors.logo} />
      </div>
      
      <div>
        <Label htmlFor="partner_type">{t("partner.form.partnerType")}</Label>
        <Select 
          value={formData.partner_type} 
          onValueChange={(value) => setFormData((d) => ({ ...d, partner_type: value as any }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("partner.form.selectPartnerType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strategic">{t("partner.types.strategic")}</SelectItem>
            <SelectItem value="gold">{t("partner.types.gold")}</SelectItem>
            <SelectItem value="silver">{t("partner.types.silver")}</SelectItem>
            <SelectItem value="bronze">{t("partner.types.bronze")}</SelectItem>
            <SelectItem value="associate">{t("partner.types.associate")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="sort_order">{t("partner.form.sortOrder")}</Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData((d) => ({ ...d, sort_order: parseInt(e.target.value) || 0 }))}
          placeholder={t("partner.form.sortOrderPlaceholder")}
          min="0"
        />
      </div>
    </div>
  )
}
