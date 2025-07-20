import { NewsCoverImage } from "./NewsCoverImage";
import { NewsHeader } from "./NewsHeader";
import { NewsContent } from "./NewsContent";
import { NewsTOCSidebar } from "./NewsTOCSidebar";
import { TocItem } from "./NewsTOC";

interface Block {
  id: string;
  type: string;
  content: string;
  media_url: string | null;
  file_size: number | null;
  file_name: string | null;
  order: number;
}

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface NewsDetailLayoutProps {
  post: {
    title?: string;
    cover_image?: string;
    user?: User;
    created_at?: string;
    summary?: string;
    blocks?: Block[];
  };
  toc: TocItem[];
  activeId?: string;
  tocWidth: string;
  isMobile: boolean;
  slugify: (str: string) => string;
}

export function NewsDetailLayout({
  post,
  toc,
  activeId,
  tocWidth,
  isMobile,
  slugify,
}: NewsDetailLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-row items-start">
      {/* Nội dung chính */}
      <main className="flex-1 w-full mx-auto md:px-0">
        <div className="w-full flex flex-col md:flex-row items-start md:items-stretch relative">
          {/* Main content */}
          <div className="flex-1 flex flex-col items-center">
            {/* Cover image */}
            <NewsCoverImage coverImage={post.cover_image} title={post.title} />
            
            {/* Header */}
            <NewsHeader
              title={post.title}
              user={post.user}
              createdAt={post.created_at}
              summary={post.summary}
            />
            
            {/* Content */}
            <div className="w-full max-w-3xl mx-auto px-2">
              <NewsContent blocks={post.blocks} slugify={slugify} />
            </div>
          </div>
        </div>
      </main>
      
      {/* TOC Sidebar */}
      <NewsTOCSidebar
        toc={toc}
        activeId={activeId}
        tocWidth={tocWidth}
        isMobile={isMobile}
      />
    </div>
  );
} 