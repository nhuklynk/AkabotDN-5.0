"use client";

import { MapPin, Phone, Mail, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/hooks/useLocale";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect } from "react";

interface SubscriptionFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  content: string;
}

export default function ContactPage() {
  const { t } = useLocale();
  const { createSubscription, loading, error, clearError } = useSubscription();
  const { show } = useToast();
  
  // Test toast khi component mount
  useEffect(() => {
    console.log("Testing toast...");
    try {
      show({ variant: "info", description: "Test toast notification" });
      console.log("Toast called successfully");
    } catch (error) {
      console.error("Toast error:", error);
    }
  }, [show]);
  
  const [formData, setFormData] = useState<SubscriptionFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    content: ""
  });
  
  const [formErrors, setFormErrors] = useState<Partial<SubscriptionFormData>>({});

  // Clear API error when component unmounts or when error changes
  useEffect(() => {
    if (error) {
      show({ variant: "destructive", description: error });
      clearError();
    }
  }, [error, clearError, show]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SubscriptionFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("contact.newsletter.errors.fullNameRequired");
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = t("contact.newsletter.errors.fullNameMinLength");
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t("contact.newsletter.errors.phoneRequired");
    } else if (!/^[0-9]+$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = t("contact.newsletter.errors.phoneInvalid");
    } else if (formData.phoneNumber.trim().length < 10) {
      newErrors.phoneNumber = t("contact.newsletter.errors.phoneMinLength");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contact.newsletter.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.newsletter.errors.emailInvalid");
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SubscriptionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const subscriptionData = {
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      content: formData.content.trim() || undefined
    };

    const result = await createSubscription(subscriptionData);
    
    if (result) {
      show({ variant: "success", description: "Đăng ký nhận tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất." });
      
      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        content: ""
      });
      setFormErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0033FF] to-[#977DFF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("contact.hero.title")}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {t("contact.hero.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>{t("contact.hero.phone")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{t("contact.hero.email")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{t("contact.hero.address")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Main Content - Contact Info & Map */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Information & Quick Contact */}
          <div className="space-y-6">
            {/* Contact Information Card */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#0033FF]">
                  {t("contact.info.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.contactPerson.title")}
                    </p>
                    <p className="text-[#0600AF]/80">
                      {t("contact.info.contactPerson.name")}
                    </p>
                    <p className="text-sm text-[#0600AF]/60">
                      {t("contact.info.contactPerson.position")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.office.title")}
                    </p>
                    <p className="text-[#0600AF]/80 whitespace-pre-line">
                      {t("contact.info.office.address")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.phone.title")}
                    </p>
                    <p className="text-[#0600AF]/80">
                      {t("contact.info.phone.number")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.email.title")}
                    </p>
                    <div className="space-y-1">
                      <p className="text-[#0600AF]/80">
                        {t("contact.info.email.primary")}
                      </p>
                      <p className="text-[#0600AF]/80">
                        {t("contact.info.email.secondary")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#0033FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0600AF]">
                      {t("contact.info.workingHours.title")}
                    </p>
                    <div className="text-[#0600AF]/80 text-sm">
                      <p>{t("contact.info.workingHours.weekdays")}</p>
                      <p>{t("contact.info.workingHours.saturday")}</p>
                      <p>{t("contact.info.workingHours.sunday")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Subscription Card */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[#0033FF] mb-4">
                  {t("contact.newsletter.title")}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0600AF] flex items-center gap-1">
                      {t("contact.newsletter.fullName")}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder={t("contact.newsletter.fullNamePlaceholder")}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={`border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20 ${
                        formErrors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      required
                    />
                    {formErrors.fullName && (
                      <p className="text-sm text-red-500">{formErrors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0600AF] flex items-center gap-1">
                      {t("contact.newsletter.phone")}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder={t("contact.newsletter.phonePlaceholder")}
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className={`border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20 ${
                        formErrors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      required
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0600AF] flex items-center gap-1">
                      {t("contact.newsletter.email")}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder={t("contact.newsletter.emailPlaceholder")}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20 ${
                        formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#0600AF]">
                      {t("contact.newsletter.content")}
                    </label>
                    <Textarea
                      placeholder={t("contact.newsletter.contentPlaceholder")}
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      className="border-[#977DFF]/30 focus:border-[#0033FF] focus:ring-[#0033FF]/20 min-h-[80px]"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0033FF] hover:bg-[#0033FF]/90 text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Đang xử lý..." : t("contact.newsletter.subscribeButton")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-[#0033FF] flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  {t("contact.map.title")}
                </CardTitle>
                <p className="text-[#0600AF]/70">{t("contact.map.subtitle")}</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-square lg:aspect-[4/3] bg-gradient-to-br from-slate-50 to-blue-100 rounded-lg overflow-hidden border border-slate-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6962326256447!2d105.84117731533447!3d21.01624939383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86a2e8c4e7%3A0x5c4a8b8b8b8b8b8b!2sCung%20V%C4%83n%20h%C3%B3a%20Thanh%20ni%C3%AAn!5e0!3m2!1svi!2s!4v1635000000000!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t("contact.map.title")}
                  ></iframe>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-[#0033FF] mb-1">
                        {t("contact.map.fullAddress.title")}
                      </p>
                      <p className="text-sm text-[#0600AF]/80 whitespace-pre-line">
                        {t("contact.map.fullAddress.content")}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0033FF] mb-1">
                        {t("contact.map.transportation.title")}
                      </p>
                      <p className="text-sm text-[#0600AF]/80 whitespace-pre-line">
                        {t("contact.map.transportation.content")}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0033FF] mb-1">
                        {t("contact.map.postalCode.title")}
                      </p>
                      <p className="text-sm text-[#0600AF]/80 whitespace-pre-line">
                        {t("contact.map.postalCode.content")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
