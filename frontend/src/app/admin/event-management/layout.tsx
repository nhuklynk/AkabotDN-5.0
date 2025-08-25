"use client";

import React, { ReactNode, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center">
          <Spinner size={36} className="text-foreground" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}


