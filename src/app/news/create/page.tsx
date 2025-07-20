"use client";

import { NewsCreateForm } from "@/components/news/NewsCreateForm";

export default function CreateNewsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tạo Bài Báo Mới
          </h1>
          <p className="text-gray-600">
            Viết và chia sẻ bài báo của bạn với cộng đồng
          </p>
        </div>
        
        <NewsCreateForm />
      </div>
    </div>
  );
} 