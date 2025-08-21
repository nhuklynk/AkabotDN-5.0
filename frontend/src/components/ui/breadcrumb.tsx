import Link from "next/link"
import { cn } from "@/lib/utils"

export type BreadcrumbItem = {
  href: string
  label: string
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("hidden md:flex items-center text-xs text-muted-foreground", className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <div key={item.href} className="flex items-center">
            {idx > 0 && <span className="mx-2">/</span>}
            {isLast ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}


