"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, User, Tag, Users } from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { formatDate } from "@/utils/dateUtils";
import { truncateText } from "@/utils/textUtils";
import { useLocale } from "@/hooks/useLocale";
import { useActivities } from "@/hooks/useActivities";

interface ActivitiesGridProps {
  onPaginationUpdate: (info: {
    totalActivities: number;
    currentPage: number;
    totalPages: number;
    activitiesPerPage: number;
  }) => void;
}

export function ActivitiesGrid({ onPaginationUpdate }: ActivitiesGridProps) {
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);

  const {
    activities,
    loading,
    error,
    pagination,
    fetchActivities,
    setCurrentPage,
  } = useActivities();

  // Update parent component with pagination info
  useEffect(() => {
    if (pagination && pagination.total >= 0) {
      onPaginationUpdate({
        totalActivities: pagination.total,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        activitiesPerPage: pagination.limit,
      });
    }
  }, [
    pagination.total,
    pagination.currentPage,
    pagination.totalPages,
    pagination.limit,
    onPaginationUpdate,
  ]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Set mounted state for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading && activities.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">{t("activities.loading")}</p>
        </div>
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => fetchActivities()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {t("activities.retry")}
        </button>
      </div>
    );
  }

  // Use fallback if no activities
  const displayActivities = activities.length > 0 ? activities : [];

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("activities.noActivities")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayActivities.map((activity) => (
          <Card
            key={activity.id}
            className="group hover:shadow-lg transition-shadow border-slate-200 shadow-lg"
          >
            <Link href={`/posts/${activity.slug}`}>
              <CardContent className="p-0 border-slate-200 shadow-lg">
                {/* Activity Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={
                      activity.featured_image ||
                      "/icons/activities-placeholder.svg"
                    }
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800 border-orange-200"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {t("activities.badge")}
                    </Badge>
                  </div>
                  {activity.categories && activity.categories.length > 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 border-emerald-200"
                      >
                        {activity.categories[0].name}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Activity Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                    {truncateText(activity.title, 80)}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 min-h-[4.5rem]">
                    {truncateText(
                      activity.summary ||
                        activity.excerpt ||
                        t("activities.noDescription"),
                      120
                    )}
                  </p>

                  {/* Activity Meta */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>
                        {activity.user?.email ||
                          activity.author_name ||
                          t("activities.author")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {mounted
                          ? formatDate(activity.created_at)
                          : activity.created_at?.split("T")[0] ||
                            t("activities.unknownDate")}
                      </span>
                    </div>

                    {/* Tags */}
                    {activity.tags && activity.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <div className="flex flex-wrap gap-1">
                          {activity.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {activity.tags.length > 2 && (
                            <span className="text-xs">
                              +{activity.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
