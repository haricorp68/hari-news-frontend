'use client'
import { useSidebar } from '@/components/ui/sidebar'
import { BookOpen } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SIDEBAR_WIDTH = '16rem'

export type TocItem = { id: string; label: string; level: number }

function TocList({ toc, onClick }: { toc: TocItem[]; onClick?: () => void }) {
  return (
    <ul className="space-y-2">
      {toc.map((item) => (
        <li key={item.id} className={item.level > 1 ? 'ml-4' : ''}>
          <a
            href={`#${item.id}`}
            className="block text-sm text-muted-foreground hover:text-primary transition"
            onClick={onClick}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function NewsTOC({ toc = [] }: { toc?: TocItem[] }) {
  const { state, isMobile } = useSidebar()

  // MOBILE: Floating button mở Sheet
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg p-3 bg-background border"
            size="icon"
            variant="outline"
          >
            <BookOpen className="w-6 h-6" />
            <span className="sr-only">Mục lục</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="max-w-xs w-full">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold text-base">Mục lục</span>
          </div>
          <TocList toc={toc} />
        </SheetContent>
      </Sheet>
    )
  }

  // SIDEBAR COLLAPSED: chỉ hiện icon, bấm mở dropdown
  if (state === 'collapsed') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex flex-col items-center justify-center h-full w-full"
            size="icon"
            variant="ghost"
          >
            <BookOpen className="w-6 h-6" />
            <span className="sr-only">Mục lục</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56 p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold text-base">Mục lục</span>
          </div>
          <TocList toc={toc} />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // SIDEBAR EXPANDED: hiện đầy đủ
  return (
    <nav
      className={cn(
        'h-full px-4 py-6 overflow-y-auto transition-all duration-200',
        'w-full'
      )}
      style={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        maxWidth: SIDEBAR_WIDTH,
      }}
      aria-label="Mục lục"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5" />
        <span className="font-semibold text-base">Mục lục</span>
      </div>
      <TocList toc={toc} />
    </nav>
  )
}

export default NewsTOC;
