"use client";
import { useParams } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { TocItem } from "@/components/news/NewsTOC";
import { NewsDetailLayout, useActiveHeading, slugify } from "@/components/news";
import { useUserNewsPostDetail } from "@/lib/modules/post/hooks/useUserNewsPostDetail";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from "@/components/layout/Sidebar";

export default function NewsDetailPage() {
  const params = useParams();
  const postId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";
  const { post, postLoading } = useUserNewsPostDetail(postId);
  const { state, isMobile } = useSidebar();

  // Sinh TOC từ post.blocks
  const toc: TocItem[] = Array.isArray(post?.blocks)
    ? post.blocks
        .filter(
          (block: any) =>
            block?.type === "heading_1" ||
            block?.type === "heading_2" ||
            block?.type === "heading_3"
        )
        .map((block: any) => ({
          id: slugify(block?.content ?? ""),
          label: block?.content ?? "",
          level:
            block?.type === "heading_1"
              ? 1
              : block?.type === "heading_2"
              ? 2
              : 3,
        }))
    : [];

  // Tính width cho TOC
  const tocWidth = state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;

  const activeId = useActiveHeading(toc);

  if (postLoading)
    return <div className="w-full text-center py-10">Đang tải dữ liệu...</div>;
  if (!post)
    return (
      <div className="w-full text-center py-10 text-red-500">
        Không tìm thấy bài viết.
      </div>
    );

  return (
    <NewsDetailLayout
      post={post}
      toc={toc}
      activeId={activeId}
      tocWidth={tocWidth}
      isMobile={isMobile}
      slugify={slugify}
    />
  );
}
