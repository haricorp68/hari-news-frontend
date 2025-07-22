"use client";
import { useRef, useEffect, useState, useMemo } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const SIDEBAR_WIDTH = "16rem";
export type TocItem = { id: string; label: string; level: number };

function TocAccordion({
  toc,
  activeId,
  onClick,
}: {
  toc: TocItem[];
  activeId?: string;
  onClick?: () => void;
}) {
  // Group heading_1 và các heading con
  const groups: { h1: TocItem; children: TocItem[] }[] = [];
  let current: { h1: TocItem; children: TocItem[] } | null = null;
  toc.forEach((item) => {
    if (item.level === 1) {
      if (current) groups.push(current);
      current = { h1: item, children: [] };
    } else if (current) {
      current.children.push(item);
    }
  });
  if (current) groups.push(current);

  // Tìm heading cha của activeId (nếu activeId là con)
  const parentId = useMemo(() => {
    for (const group of groups) {
      if (group.h1.id === activeId) return group.h1.id;
      if (group.children.some((c) => c.id === activeId)) return group.h1.id;
    }
    return undefined;
  }, [groups, activeId]);

  // State controlled cho Accordion
  const [openItems, setOpenItems] = useState<string[]>([]);
  useEffect(() => {
    if (parentId) {
      setOpenItems((prev) => (prev.includes(parentId) ? prev : [parentId]));
    }
  }, [parentId]);

  // Scroll active heading into view
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeId]);

  return (
    <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
      {groups.map((group) => (
        <AccordionItem key={group.h1.id} value={group.h1.id}>
          {group.children.length === 0 ? (
            // Nếu không có con, chỉ là link, không phải accordion
            <div
              className={
                "text-xs px-2 cursor-pointer select-none py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] " +
                (group.h1.id === activeId || parentId === group.h1.id
                  ? "font-bold text-primary"
                  : "text-muted-foreground hover:text-primary")
              }
            >
              <a
                href={`#${group.h1.id}`}
                className="block w-full h-full"
                onClick={onClick}
              >
                {group.h1.label}
              </a>
            </div>
          ) : (
            <AccordionTrigger
              className={
                "text-xs px-2 " +
                (group.h1.id === activeId || parentId === group.h1.id
                  ? "font-bold text-primary"
                  : "text-muted-foreground hover:text-primary")
              }
              hideIcon={false}
            >
              <a
                href={`#${group.h1.id}`}
                className="block w-full h-full"
                onClick={onClick}
                tabIndex={-1}
                style={{ pointerEvents: "auto" }}
              >
                {group.h1.label}
              </a>
            </AccordionTrigger>
          )}
          {group.children.length > 0 && (
            <AccordionContent className="pl-2">
              <ul className="space-y-1">
                {group.children.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      item.level === 2 && "ml-2 pl-2 border-l border-muted",
                      item.level === 3 && "ml-4 pl-3 border-l-2 border-primary/30"
                    )}
                  >
                    <a
                      ref={item.id === activeId ? activeRef : undefined}
                      href={`#${item.id}`}
                      className={cn(
                        "block transition",
                        item.level === 2 && "text-xs text-muted-foreground",
                        item.level === 3 && "text-[11px] text-muted-foreground/70 italic",
                        item.id === activeId
                          ? "font-bold text-primary"
                          : "hover:text-primary"
                      )}
                      onClick={onClick}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function NewsTOC({
  toc = [],
  activeId,
}: {
  toc?: TocItem[];
  activeId?: string;
}) {
  const { state, isMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed  bottom-6 right-6 z-50 rounded-full shadow-lg p-3 bg-background border"
            size="icon"
            variant="outline"
          ></Button>
        </SheetTrigger>
        <SheetContent side="right" className="max-w-xs w-full">
          <TocAccordion toc={toc} activeId={activeId} />
        </SheetContent>
      </Sheet>
    );
  }

  if (state === "collapsed") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex flex-col items-center justify-center w-12 border"
            size="icon"
            variant="ghost"
          >
            <BookOpen />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56 p-4">
          <TocAccordion toc={toc} activeId={activeId} />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <nav
      className={cn(
        "h-full px-4 py-2 overflow-y-auto transition-all duration-200 scrollbar-hide",
        "w-full"
      )}
      style={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        maxWidth: SIDEBAR_WIDTH,
      }}
      aria-label="Mục lục"
    >
      <TocAccordion toc={toc} activeId={activeId} />
    </nav>
  );
}

export default NewsTOC;
