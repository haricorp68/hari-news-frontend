"use client";
import { useSidebar } from "@/components/ui/sidebar";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSidebar(); // Đảm bảo context nếu cần

  return (
    <div className="min-h-screen bg-background flex flex-row items-start ">
      {/* Nội dung chính */}
      <main className="flex-1 w-full mx-auto md:px-0">{children}</main>
      {/* Không render TOC ở layout nữa */}
    </div>
  );
}
