import React from "react";
import { TableOfContents, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface TOCBlock {
  id: string;
  type: string;
  content: string;
}

interface TOCPopoverProps {
  toc: TOCBlock[];
  slugify: (str: string) => string;
  show: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export const TOCPopover: React.FC<TOCPopoverProps> = ({
  toc,
  slugify,
  show,
  onClose,
  onToggle,
}) => {
  return (
    <>
      {/* TOC Toggle Buttons */}
      {/* Desktop Button */}
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex fixed top-32 right-10 z-40 items-center gap-2 rounded-xl "
        onClick={onToggle}
      >
        <TableOfContents className="h-4 w-4" />
      </Button>

      {/* Mobile Button */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
        onClick={onToggle}
      >
        <TableOfContents className="h-4 w-4 text-blue-500" />
        Mục lục
      </Button>

      {/* TOC Popover */}
      {show && (
        <div>
          {/* Overlay for mobile, background click to close */}
          <div
            className="fixed inset-0 bg-black/30 z-50 md:hidden"
            onClick={onClose}
          />

          {/* Popover/Sidebar */}
          <Card className="fixed top-0 right-0 z-50 h-full w-80 max-w-full shadow-xl flex flex-col md:rounded-l-xl md:top-24 md:h-auto md:w-80 md:right-10 md:shadow-lg border-l-0 md:border-l">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <TableOfContents className="h-4 w-4" />
                  Mục lục
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={onClose}
                  aria-label="Đóng mục lục"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <nav>
                  <ul className="space-y-1">
                    {toc.map((block) => {
                      const id = slugify(block.content);
                      let indentClass = "";

                      if (block.type === "heading_2") indentClass = "ml-4";
                      if (block.type === "heading_3") indentClass = "ml-8";

                      return (
                        <li key={block.id} className={indentClass}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start h-auto p-2 text-left font-normal",
                              "text-sm text-muted-foreground hover:text-foreground",
                              "hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => {
                              const element = document.getElementById(id);
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                              }
                              onClose();
                            }}
                          >
                            {block.content}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
