"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, FileText, Users, Building, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  memberService,
  RegisterMemberWithCompanyData,
} from "@/services/end-user/memberService";
import { CreateCompanyData } from "@/services/end-user/companyService";
import { useLocale } from "@/hooks/useLocale";

export default function MemberRegistrationPage() {
  const { t } = useLocale();
  const [membershipType, setMembershipType] = useState<
    "individual" | "corporate"
  >("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state for user information
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
  });

  // Form state for member information
  const [memberForm, setMemberForm] = useState({
    job_title: "",
    work_unit: "",
    expertise_level: "beginner" as
      | "beginner"
      | "intermediate"
      | "advanced"
      | "expert",
    assistant_info: "",
    curriculum_vitae_url: "",
    membership_registration_form_url: "",
  });

  // Form state for company information (only for corporate members)
  const [companyForm, setCompanyForm] = useState({
    name: "",
    tax_number: "",
    email: "",
    phone_number: "",
    business_registration_form_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Basic validation
    if (userForm.password !== userForm.confirmPassword) {
      setMessage({
        type: "error",
        text: t("members.register.messages.passwordMismatch"),
      });
      return;
    }

    if (!userForm.email || !userForm.password || !userForm.full_name) {
      setMessage({
        type: "error",
        text: t("members.register.messages.missingRequiredFields"),
      });
      return;
    }

    if (
      membershipType === "corporate" &&
      (!companyForm.name ||
        !companyForm.tax_number ||
        !companyForm.email ||
        !companyForm.phone_number)
    ) {
      setMessage({
        type: "error",
        text: t("members.register.messages.missingCompanyInfo"),
      });
      return;
    }

    setIsLoading(true);

    try {
      const registrationData: RegisterMemberWithCompanyData = {
        // User information
        email: userForm.email,
        password: userForm.password,
        full_name: userForm.full_name,
        phone: userForm.phone,
        // status will be set to default by backend

        // Member information
        membership_type: membershipType,
        job_title: memberForm.job_title,
        work_unit: memberForm.work_unit,
        expertise_level: memberForm.expertise_level,
        assistant_info: memberForm.assistant_info,
        curriculum_vitae_url: memberForm.curriculum_vitae_url,
        membership_registration_form_url:
          memberForm.membership_registration_form_url,
      };

      // Add company data for corporate members
      if (membershipType === "corporate") {
        registrationData.company = {
          name: companyForm.name,
          tax_number: companyForm.tax_number,
          email: companyForm.email,
          phone_number: companyForm.phone_number,
          business_registration_form_url:
            companyForm.business_registration_form_url,
        };
      }

      const response = await memberService.registerMemberWithCompany(
        registrationData
      );

      setMessage({
        type: "success",
        text: t("members.register.messages.success"),
      });

      // Reset forms on success
      setUserForm({
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        phone: "",
      });
      setMemberForm({
        job_title: "",
        work_unit: "",
        expertise_level: "beginner",
        assistant_info: "",
        curriculum_vitae_url: "",
        membership_registration_form_url: "",
      });
      setCompanyForm({
        name: "",
        tax_number: "",
        email: "",
        phone_number: "",
        business_registration_form_url: "",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          t("members.register.messages.genericError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0033FF] mb-2">
            {t("members.register.title")}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#977DFF] to-[#0033FF]"></div>
        </div>

        {/* Show message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="outline"
            className={`flex items-center gap-2 transition-all duration-200 ${
              membershipType === "individual"
                ? "bg-[#0033FF] border-[#0033FF] text-white hover:bg-[#0033FF]/90"
                : "bg-transparent border-[#977DFF] text-[#0600AF] hover:bg-blue-50 hover:border-[#0033FF]"
            }`}
            onClick={() => setMembershipType("individual")}
            disabled={isLoading}
          >
            <Users className="w-4 h-4" />
            {t("members.register.membershipType.individual")}
          </Button>
          <Button
            variant="outline"
            className={`flex items-center gap-2 transition-all duration-200 ${
              membershipType === "corporate"
                ? "bg-[#0033FF] border-[#0033FF] text-white hover:bg-[#0033FF]/90"
                : "bg-transparent border-[#977DFF] text-[#0600AF] hover:bg-blue-50 hover:border-[#0033FF]"
            }`}
            onClick={() => setMembershipType("corporate")}
            disabled={isLoading}
          >
            <Building className="w-4 h-4" />
            {t("members.register.membershipType.corporate")}
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* User Information Form */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-300/30">
                <CardTitle className="text-xl font-semibold text-[#0033FF]">
                  {t("members.register.forms.accountInfo.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.accountInfo.email")}{" "}
                      <span className="text-red-500">
                        {t("members.register.required")}
                      </span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.accountInfo.placeholders.email"
                      )}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="full_name"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.accountInfo.fullName")}{" "}
                      <span className="text-red-500">
                        {t("members.register.required")}
                      </span>
                    </Label>
                    <Input
                      id="full_name"
                      value={userForm.full_name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, full_name: e.target.value })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.accountInfo.placeholders.fullName"
                      )}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.accountInfo.phone")}
                    </Label>
                    <Input
                      id="phone"
                      value={userForm.phone}
                      onChange={(e) =>
                        setUserForm({ ...userForm, phone: e.target.value })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.accountInfo.placeholders.phone"
                      )}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.accountInfo.password")}{" "}
                      <span className="text-red-500">
                        {t("members.register.required")}
                      </span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) =>
                        setUserForm({ ...userForm, password: e.target.value })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.accountInfo.placeholders.password"
                      )}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.accountInfo.confirmPassword")}{" "}
                      <span className="text-red-500">
                        {t("members.register.required")}
                      </span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={userForm.confirmPassword}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.accountInfo.placeholders.confirmPassword"
                      )}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Information Form */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-300/30">
                <CardTitle className="text-xl font-semibold text-[#0033FF]">
                  {t("members.register.forms.memberInfo.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="job_title"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.memberInfo.jobTitle")}
                    </Label>
                    <Input
                      id="job_title"
                      value={memberForm.job_title}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          job_title: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.memberInfo.placeholders.jobTitle"
                      )}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="work_unit"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.memberInfo.workUnit")}
                    </Label>
                    <Input
                      id="work_unit"
                      value={memberForm.work_unit}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          work_unit: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.memberInfo.placeholders.workUnit"
                      )}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="expertise_level"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.memberInfo.expertiseLevel")}
                    </Label>
                    <Select
                      value={memberForm.expertise_level}
                      onValueChange={(
                        value:
                          | "beginner"
                          | "intermediate"
                          | "advanced"
                          | "expert"
                      ) =>
                        setMemberForm({ ...memberForm, expertise_level: value })
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="border-slate-300 focus:border-[#0033FF]">
                        <SelectValue
                          placeholder={t(
                            "members.register.forms.memberInfo.placeholders.expertiseLevel"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">
                          {t(
                            "members.register.forms.memberInfo.expertiseLevels.beginner"
                          )}
                        </SelectItem>
                        <SelectItem value="intermediate">
                          {t(
                            "members.register.forms.memberInfo.expertiseLevels.intermediate"
                          )}
                        </SelectItem>
                        <SelectItem value="advanced">
                          {t(
                            "members.register.forms.memberInfo.expertiseLevels.advanced"
                          )}
                        </SelectItem>
                        <SelectItem value="expert">
                          {t(
                            "members.register.forms.memberInfo.expertiseLevels.expert"
                          )}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="assistant_info"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.memberInfo.assistantInfo")}
                    </Label>
                    <Textarea
                      id="assistant_info"
                      value={memberForm.assistant_info}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          assistant_info: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.memberInfo.placeholders.assistantInfo"
                      )}
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="curriculum_vitae_url"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.memberInfo.cvUrl")}
                    </Label>
                    <Input
                      id="curriculum_vitae_url"
                      value={memberForm.curriculum_vitae_url}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          curriculum_vitae_url: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.memberInfo.placeholders.cvUrl"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Information Form (only for corporate members) */}
          {membershipType === "corporate" && (
            <Card className="border-slate-200 bg-white mt-8 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-300/30">
                <CardTitle className="text-xl font-semibold text-[#0033FF]">
                  {t("members.register.forms.companyInfo.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="company_name"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.companyInfo.name")}{" "}
                      <span className="text-red-500">
                        {t("members.register.required")}
                      </span>
                    </Label>
                    <Input
                      id="company_name"
                      value={companyForm.name}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, name: e.target.value })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.companyInfo.placeholders.name"
                      )}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="tax_number"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.companyInfo.taxNumber")}{" "}
                      <span className="text-red-500">
                        {t("members.register.required")}
                      </span>
                    </Label>
                    <Input
                      id="tax_number"
                      value={companyForm.tax_number}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          tax_number: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.companyInfo.placeholders.taxNumber"
                      )}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="company_email"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.companyInfo.email")}{" "}
                      <span className="text-red-500">
                        {t("members.register.required")}
                      </span>
                    </Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={companyForm.email}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          email: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.companyInfo.placeholders.email"
                      )}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="company_phone"
                      className="text-[#0600AF] font-medium"
                    >
                      {t("members.register.forms.companyInfo.phone")}{" "}
                      <span className="text-red-500">
                        {t("members.register.required")}
                      </span>
                    </Label>
                    <Input
                      id="company_phone"
                      value={companyForm.phone_number}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          phone_number: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.companyInfo.placeholders.phone"
                      )}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <Label
                      htmlFor="business_registration_form_url"
                      className="text-[#0600AF] font-medium"
                    >
                      {t(
                        "members.register.forms.companyInfo.businessRegistrationUrl"
                      )}
                    </Label>
                    <Input
                      id="business_registration_form_url"
                      value={companyForm.business_registration_form_url}
                      onChange={(e) =>
                        setCompanyForm({
                          ...companyForm,
                          business_registration_form_url: e.target.value,
                        })
                      }
                      className="border-slate-300 focus:border-[#0033FF]"
                      placeholder={t(
                        "members.register.forms.companyInfo.placeholders.businessRegistrationUrl"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white px-12 py-3 text-lg font-semibold border-0 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("members.register.buttons.processing")}
                </>
              ) : (
                t("members.register.buttons.register")
              )}
            </Button>
          </div>
        </form>

        {/* Reference Information Card */}
        <Card className="border-slate-200 bg-white mt-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-300/30">
            <CardTitle className="text-xl font-semibold text-[#0033FF]">
              {t("members.register.contactInfo.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-[#0600AF] mb-2">
                  {t("members.register.contactInfo.support")}
                </p>
                <div className="space-y-2">
                  <p className="text-[#0600AF]/80">📧 vanphongNDA@nda.org.vn</p>
                  <p className="text-[#0600AF]/80">📧 thaottp@nda.org.vn</p>
                  <p className="text-[#0600AF]/80">
                    📞 0931.399.883 (Trương T.Phương Thảo)
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-[#0600AF] mb-2">
                  {t("members.register.contactInfo.address")}
                </p>
                <p className="text-[#0600AF]/80">
                  {t("members.register.contactInfo.addressDetails")
                    .split("\n")
                    .map((line, index) => (
                      <span key={index}>
                        {line}
                        {index <
                          t(
                            "members.register.contactInfo.addressDetails"
                          ).split("\n").length -
                            1 && <br />}
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
