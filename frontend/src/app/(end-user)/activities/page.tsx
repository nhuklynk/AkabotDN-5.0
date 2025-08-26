"use client";

import { useState, useCallback } from "react";
import { ActivitiesGrid } from "@/app/(end-user)/activities/components/activities-grid";
import { ActivitiesInfo } from "@/app/(end-user)/activities/components/activities-info";
import { EventsGrid } from "@/app/(end-user)/activities/components/events-grid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import Link from "next/link";

export default function ActivitiesPage() {
  const { t } = useLocale();
  const [paginationInfo, setPaginationInfo] = useState({
    totalActivities: 0,
    currentPage: 1,
    totalPages: 1,
    activitiesPerPage: 10,
  });

  const handlePaginationUpdate = useCallback(
    (info: {
      totalActivities: number;
      currentPage: number;
      totalPages: number;
      activitiesPerPage: number;
    }) => {
      setPaginationInfo(info);
    },
    []
  ); // Empty dependency array - function never changes
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">
                {t("activities.breadcrumb.home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("activities.breadcrumb.activities")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("activities.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t("activities.description")}
          </p>
        </div>

        <ActivitiesInfo
          totalActivities={paginationInfo.totalActivities}
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          activitiesPerPage={paginationInfo.activitiesPerPage}
        />

        <ActivitiesGrid onPaginationUpdate={handlePaginationUpdate} />

        {/* Events Section */}
        <section className="mt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {t("events.upcomingEvents")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t("events.sectionDescription")}
            </p>
          </div>
          <EventsGrid showUpcoming={false} limit={6} />
        </section>
      </main>
    </div>
  );
}
