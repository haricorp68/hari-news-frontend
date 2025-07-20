import { NewsTOC, TocItem } from "./NewsTOC";

interface NewsTOCSidebarProps {
  toc: TocItem[];
  activeId?: string;
  tocWidth: string;
  isMobile: boolean;
}

export function NewsTOCSidebar({ toc, activeId, tocWidth, isMobile }: NewsTOCSidebarProps) {
  if (isMobile) return null;

  return (
    <aside
      className="hidden md:block transition-all duration-200"
      style={{
        width: tocWidth,
        minWidth: tocWidth,
        maxWidth: tocWidth,
      }}
    >
      <div className="fixed h-[calc(100vh-4rem)]">
        <NewsTOC toc={toc} activeId={activeId} />
      </div>
    </aside>
  );
} 