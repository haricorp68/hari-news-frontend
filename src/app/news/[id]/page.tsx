"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatFullTime } from "@/utils/formatTime";
import newsData from "@/lib/modules/post/news.temp.json";
import { UserProfileLink } from "@/components/ui/user-profile-link";
import { NewsTOC, TocItem } from "@/components/news/NewsTOC";
import { useSidebar } from "@/components/ui/sidebar";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";

export default function NewsDetailPage() {
  const post = newsData;
  const { state, isMobile } = useSidebar();

  // Hàm tạo id từ content (đơn giản hóa, có thể cải tiến)
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u1EF9\s-]/gi, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // Sinh TOC từ post.blocks
  const toc: TocItem[] = Array.isArray(post.blocks)
    ? post.blocks
        .filter(
          (block) =>
            block.type === "heading_1" ||
            block.type === "heading_2" ||
            block.type === "heading_3"
        )
        .map((block) => ({
          id: slugify(block.content),
          label: block.content,
          level:
            block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3,
        }))
    : [];

  // Tính width cho TOC
  const tocWidth = state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;

  return (
    <div className="min-h-screen bg-background flex flex-row items-start ">
      {/* Nội dung chính */}
      <main className="flex-1 w-full mx-auto md:px-0">
        <div className="w-full flex flex-col md:flex-row items-start md:items-stretch relative">
          {/* Main content */}
          <div className="flex-1 flex flex-col items-center">
            {/* Cover image */}
            <div className="relative w-full aspect-[16/9] max-w-5xl mx-auto">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover w-full h-full"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
            <div className="w-full max-w-3xl mx-auto px-2">
              {/* Title & meta */}
              <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight mt-8">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <UserProfileLink user={post.user} avatarOnly>
                    <Avatar className="w-9 h-9">
                      <AvatarImage
                        src={post.user.avatar || undefined}
                        alt={post.user.name}
                      />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                  </UserProfileLink>
                  <UserProfileLink
                    user={post.user}
                    className="text-base font-medium text-gray-800 hover:underline"
                  >
                    {post.user.name}
                  </UserProfileLink>
                </div>
                <div className="flex flex-col items-end text-xs text-gray-500 min-w-fit">
                  <span>{formatFullTime(post.created_at)}</span>
                </div>
              </div>
              {/* Tags */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs font-normal px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Summary */}
              <div className="text-lg text-gray-700 mb-6">{post.summary}</div>
              {/* Content blocks */}
              <div className="prose prose-neutral max-w-none mb-8">
                {post.blocks.map((block) => {
                  if (block.type === "heading_1")
                    return (
                      <h2
                        key={block.id}
                        id={slugify(block.content)}
                        className="text-2xl font-bold mt-8 mb-2 scroll-mt-24"
                      >
                        {block.content}
                      </h2>
                    );
                  if (block.type === "heading_2")
                    return (
                      <h3
                        key={block.id}
                        id={slugify(block.content)}
                        className="text-xl font-semibold mt-6 mb-2 scroll-mt-24"
                      >
                        {block.content}
                      </h3>
                    );
                  if (block.type === "heading_3")
                    return (
                      <h4
                        key={block.id}
                        id={slugify(block.content)}
                        className="text-lg font-semibold mt-4 mb-2 scroll-mt-24"
                      >
                        {block.content}
                      </h4>
                    );
                  if (block.type === "text")
                    return (
                      <p key={block.id} className="mb-4 text-base">
                        {block.content}
                      </p>
                    );
                  if (block.type === "image" && block.media_url)
                    return (
                      <div
                        key={block.id}
                        className="my-6 flex flex-col items-center w-full"
                      >
                        <Image
                          src={block.media_url}
                          alt={block.content || "image"}
                          width={900}
                          height={500}
                          className="rounded-xl object-contain max-h-[500px] w-full max-w-3xl"
                        />
                        {block.content && (
                          <div className="text-sm text-gray-500 mt-2 italic">
                            {block.content}
                          </div>
                        )}
                      </div>
                    );
                  if (block.type === "file" && block.media_url) {
                    const sizeMB = block.file_size
                      ? `(${(block.file_size / 1024 / 1024).toFixed(1)} MB)`
                      : "";
                    return (
                      <div
                        key={block.id}
                        className="my-6 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 w-full max-w-3xl mx-auto"
                      >
                        <svg
                          width="32"
                          height="32"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="text-blue-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <div className="flex-1">
                          <div className="font-medium text-blue-700">
                            {block.file_name || "Tài liệu đính kèm"} {sizeMB}
                          </div>
                          {block.content && (
                            <div className="text-xs text-gray-500 mt-1">
                              {block.content}
                            </div>
                          )}
                        </div>
                        <a
                          href={block.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
                        >
                          Tải về
                        </a>
                      </div>
                    );
                  }
                  if (block.type === "video" && block.media_url)
                    return (
                      <div
                        key={block.id}
                        className="my-6 flex flex-col items-center w-full"
                      >
                        <video
                          src={block.media_url}
                          controls
                          className="rounded-xl max-w-3xl w-full max-h-[500px] bg-black"
                        />
                        {block.content && (
                          <div className="text-sm text-gray-500 mt-2">
                            {block.content}
                          </div>
                        )}
                      </div>
                    );
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* TOC responsive, aside phải, floating cho mobile */}
      {!isMobile && (
        <aside
          className="hidden md:block transition-all duration-200"
          style={{
            width: tocWidth,
            minWidth: tocWidth,
            maxWidth: tocWidth,
          }}
        >
          <div className="fixed min-h-screen overflow-y-auto">
            <NewsTOC toc={toc} />
          </div>
        </aside>
      )}
      {/* TOC floating cho mobile sẽ tự xử lý trong NewsTOC */}
    </div>
  );
}
