import { NewsCoverImage } from "./NewsCoverImage";
import { NewsHeader } from "./NewsHeader";
import { NewsContent } from "./NewsContent";
import { NewsTOCSidebar } from "./NewsTOCSidebar";
import { NewsDetailFooter } from "./NewsDetailFooter";
import { TocItem } from "./NewsTOC";
import { Badge } from "@/components/ui/badge";
import type { UserNewsPost } from "@/lib/modules/post/post.interface";
import { Separator } from "../ui/separator";

interface NewsDetailLayoutProps {
  post: UserNewsPost;
  toc?: TocItem[];
  activeId?: string;
  tocWidth?: string;
  isMobile: boolean;
  slugify?: (str: string) => string;
  showFooter?: boolean;
}

// Hàm slugify mặc định nếu không được truyền từ bên ngoài
const defaultSlugify = (str: string): string => {
  if (!str) return "";
  str = str.replace(/^\s+|\s+$/g, ""); // Trim khoảng trắng ở đầu và cuối
  str = str.toLowerCase(); // Chuyển sang chữ thường

  // Xử lý các ký tự có dấu và ký tự đặc biệt
  const from = "åàáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // Loại bỏ các ký tự không hợp lệ
    .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Loại bỏ nhiều dấu gạch ngang liên tiếp

  return str;
};

export function NewsDetailLayout({
  post,

  toc,
  activeId,
  tocWidth,
  isMobile,
  slugify,
  showFooter = true,
}: NewsDetailLayoutProps) {
  const effectiveSlugify = slugify || defaultSlugify;

  // Kiểm tra có TOC hay không
  const hasToc = toc && toc.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full flex flex-col lg:flex-row items-start">
        {/* Main content area */}
        <main
          className={`flex-1 w-full ${hasToc && !isMobile ? "lg:pr-6" : ""}`}
        >
          <div className="w-full max-w-6xl mx-auto">
            {/* Cover image - responsive */}
            <div className="w-full">
              <NewsCoverImage
                coverImage={post.cover_image}
                title={post.title}
              />
            </div>

            {/* Content container with responsive padding */}
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="w-full max-w-4xl mx-auto">
                <NewsHeader
                  title={post.title}
                  user={post.user}
                  createdAt={post.created_at}
                  summary={post.summary}
                />
              </div>

              {/* Tags - responsive grid */}
              {post.tags && post.tags.length > 0 && (
                <div className="w-full max-w-4xl mx-auto mb-6">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs sm:text-sm"
                      >
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Main content */}
              <div className="w-full max-w-4xl mx-auto">
                <NewsContent
                  blocks={post.blocks}
                  slugify={effectiveSlugify}
                  user={post.user}
                />

                {/* Footer */}
                {showFooter && (
                  <div className="mt-8 sm:mt-12">
                    <Separator />
                    <div className="mt-6 sm:mt-8">
                      <NewsDetailFooter post={post} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* TOC Sidebar - responsive positioning */}
        {hasToc && (
          <aside
            className={`
            ${
              isMobile
                ? "w-full order-first mb-6"
                : "hidden lg:block lg:w-64 xl:w-72 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto"
            }
          `}
          >
            <div
              className={`
              ${isMobile ? "px-4 sm:px-6" : "px-4"}
            `}
            >
              <NewsTOCSidebar
                toc={toc}
                activeId={activeId}
                tocWidth={tocWidth || (isMobile ? "w-full" : "w-full")}
                isMobile={isMobile}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
