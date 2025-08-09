import React from "react";
import { Construction, Clock } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Construction className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Trang đang phát triển
            </h1>
            <p className="text-muted-foreground">
              Chúng tôi đang xây dựng tính năng Explore. Vui lòng quay lại sau.
            </p>
          </div>

          {/* Status */}
          <div className="inline-flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Đang phát triển</span>
          </div>
        </div>
      </div>
    </div>
  );
}
