"use client";

import { EntityAutocompleteInput } from "@/components/common/EntityAutocompleteInput";
import { useAuth } from "@/lib/modules/auth/useAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, MessageSquare, Settings } from "lucide-react"; // Import thêm MessageSquare và Settings

export function Header() {
  const { profile } = useAuth();
  const isMobile = useIsMobile();

  // Chiều cao của header là h-16 (tương đương 4rem = 64px)
  // Chiều cao mong muốn của logo sẽ là chiều cao của header (h-16)
  // Tỷ lệ ảnh gốc: rộng 60 / cao 40 = 1.5
  // Nếu chiều cao là 64px, thì chiều rộng sẽ là 64px * 1.5 = 96px

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-2">
      {/* App Logo - Chỉ hiển thị trên mobile (theo yêu cầu ban đầu của bạn) */}
      {isMobile && (
        <Link href="/" className="flex items-center h-full">
          <div className="relative h-9 aspect-[1.5]">
            <Image
              src="https://res.cloudinary.com/haricorp/image/upload/v1754348466/Gemini_Generated_Image_1owgb01owgb01owg_knc0fr.png"
              alt="Hari Social Logo"
              fill
              className="object-contain rounded"
            />
          </div>
        </Link>
      )}

      {/* Search Input */}
      {/* Search input sẽ chiếm không gian linh hoạt ở giữa */}
      <div className="flex-1 flex justify-center max-w-md mx-2">
        {" "}
        {/* Thêm mx-2 để tạo khoảng cách */}
        <EntityAutocompleteInput />
      </div>

      {/* Notification, Message, Setting Icons - Luôn hiển thị và căn phải */}
      {/* Sử dụng một div để nhóm 3 nút và căn chúng sang phải */}
      <div className="flex items-center gap-1.5 ml-auto">
        {" "}
        {/* ml-auto đẩy nhóm này sang phải */}
        {/* Nút Thông báo */}
        {profile && ( // Vẫn giữ điều kiện profile cho nút thông báo nếu bạn chỉ muốn hiển thị khi đăng nhập
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
            {" "}
            {/* Sử dụng size="icon" và điều chỉnh padding/size */}
            <Bell className="h-5 w-5" />
          </Button>
        )}
        {/* Nút Messenger */}
        {profile && ( // Tùy chọn: cũng có thể chỉ hiển thị khi đăng nhập
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
        {/* Nút Setting */}
        {profile && ( // Tùy chọn: cũng có thể chỉ hiển thị khi đăng nhập
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
