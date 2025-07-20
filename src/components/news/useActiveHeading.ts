import { useEffect, useState } from "react";
import { TocItem } from "./NewsTOC";

export function useActiveHeading(toc: TocItem[]) {
  const [activeId, setActiveId] = useState<string | undefined>(toc[0]?.id);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      let currentId = toc[0]?.id;
      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (el) {
          const offset = el.getBoundingClientRect().top + window.scrollY - 100; // offset cho header
          if (scrollY >= offset) {
            currentId = item.id;
          } else {
            break;
          }
        }
      }
      setActiveId(currentId);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  return activeId;
} 