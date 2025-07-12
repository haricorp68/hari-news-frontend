"use client";

export function ProfileNotFound() {
  return (
    <div className="container mx-auto p-6 text-center">
      <div className="py-20">
        <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <span className="text-4xl text-muted-foreground">?</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">Không tìm thấy người dùng</h2>
        <p className="text-muted-foreground mb-4">
          Người dùng này có thể không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    </div>
  );
} 