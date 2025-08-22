"use client";

import React, { ReactNode, Suspense } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div>Đang tải...</div>}>{children}</Suspense>;
}
