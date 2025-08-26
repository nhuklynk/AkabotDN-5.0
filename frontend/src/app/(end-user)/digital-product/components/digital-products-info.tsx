"use client";

import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Calendar } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface DigitalProductsInfoProps {
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  productsPerPage: number;
}

export function DigitalProductsInfo({
  totalProducts,
  currentPage,
  totalPages,
  productsPerPage,
}: DigitalProductsInfoProps) {
  const { t } = useLocale();
  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className="space-y-4 mb-8">
      {/* Products Count Info */}
      <div className="bg-muted/50 p-4 rounded-lg hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">
                {t("digitalProducts.info.totalProducts", {
                  total: totalProducts,
                })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("digitalProducts.info.showing", {
                  start: startProduct,
                  end: endProduct,
                  total: totalProducts,
                })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge variant="secondary" className="text-sm">
              {t("digitalProducts.info.page", {
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
