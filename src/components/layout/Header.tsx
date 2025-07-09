"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Tạo breadcrumb từ pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: Array<{
      label: string;
      href: string;
      icon?: typeof Home;
    }> = [
      {
        label: "Trang chủ",
        href: "/",
        icon: Home,
      },
    ];

    let currentPath = "";
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Chuyển đổi segment thành label đẹp hơn
      const label = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <nav className="flex items-center gap-1 text-sm font-medium">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <Link
              href={breadcrumb.href}
              className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-foreground ${
                index === breadcrumbs.length - 1
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4" />}
              <span>{breadcrumb.label}</span>
            </Link>
          </div>
        ))}
      </nav>
    </header>
  );
} 