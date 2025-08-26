"use client";

import { useState, useCallback } from "react";
import { DigitalProductsGrid } from "@/app/(end-user)/digital-product/components/digital-products-grid";
import { DigitalProductsInfo } from "@/app/(end-user)/digital-product/components/digital-products-info";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocale } from "@/hooks/useLocale";

export default function DigitalProductsPage() {
  const { t } = useLocale();
  const [paginationInfo, setPaginationInfo] = useState({
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
    productsPerPage: 10,
  });

  const handlePaginationUpdate = useCallback(
    (info: {
      totalProducts: number;
      currentPage: number;
      totalPages: number;
      productsPerPage: number;
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
                {t("digitalProducts.breadcrumb.home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("digitalProducts.breadcrumb.products")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("digitalProducts.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t("digitalProducts.description")}
          </p>
        </div>

        <DigitalProductsInfo
          totalProducts={paginationInfo.totalProducts}
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          productsPerPage={paginationInfo.productsPerPage}
        />

        <DigitalProductsGrid onPaginationUpdate={handlePaginationUpdate} />
      </main>
    </div>
  );
}
