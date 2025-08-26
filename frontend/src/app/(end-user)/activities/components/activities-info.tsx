"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface ActivitiesInfoProps {
  totalActivities: number;
  currentPage: number;
  totalPages: number;
  activitiesPerPage: number;
}

export function ActivitiesInfo({
  totalActivities,
  currentPage,
  totalPages,
  activitiesPerPage,
}: ActivitiesInfoProps) {
  const { t } = useLocale();
  const startActivity = (currentPage - 1) * activitiesPerPage + 1;
  const endActivity = Math.min(
    currentPage * activitiesPerPage,
    totalActivities
  );

  return (
    <div className="space-y-4 mb-8">
      {/* Activities Count Info */}
      <div className="bg-muted/50 p-4 rounded-lg hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">
                {t("activities.info.totalActivities", {
                  total: totalActivities,
                })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("activities.info.showing", {
                  start: startActivity,
                  end: endActivity,
                  total: totalActivities,
                })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge variant="secondary" className="text-sm">
              {t("activities.info.page", {
                current: currentPage,
                total: totalPages,
              })}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
