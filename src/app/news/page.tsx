"use client";
import { useEffect, useState } from "react";
import { NewsSummaryCardList } from "@/components/post/NewsSummaryCardList";
import newsSummaryData from "@/lib/modules/post/news.summary.temp.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScanSearch, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";
import { useNewsTagList } from "@/lib/modules/newsTag/hooks/useNewsTagList";
import { useRootCategories } from "@/lib/modules/category/hooks/useRootCategories";
import { useAutocompleteNewsTags } from "@/lib/modules/newsTag/hooks/useNewsTagAutoComplete";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { tags, tagsLoading } = useNewsTagList();
  const {
    autocompleteNewsTags,
    autocompleteNewsTagsLoading,
    autocompleteNewsTagsData,
  } = useAutocompleteNewsTags();
  const { rootCategories, rootCategoriesLoading } = useRootCategories();

  // Updated state to handle multiple selections
  const [selectedCategories, setSelectedCategories] = useState<
    {
      id: string;
      name: string;
      type: "category" | "tag";
    }[]
  >([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const handleItemClick = (
    item: { id: string; name: string },
    type: "category" | "tag"
  ) => {
    setSelectedCategories((prev) => {
      // Check if item already exists
      const exists = prev.find(
        (cat) => cat.id === item.id && cat.type === type
      );
      if (exists) {
        // Remove if already selected
        return prev.filter((cat) => !(cat.id === item.id && cat.type === type));
      } else {
        // Add if not selected
        return [...prev, { ...item, type }];
      }
    });
  };

  const handleRemoveItem = (id: string, type: "category" | "tag") => {
    setSelectedCategories((prev) =>
      prev.filter((cat) => !(cat.id === id && cat.type === type))
    );
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  const isItemSelected = (id: string, type: "category" | "tag") => {
    return selectedCategories.some((cat) => cat.id === id && cat.type === type);
  };

  // Handle search input
  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      autocompleteNewsTags(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Filter content component
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500 flex items-center gap-2">
          Categories
        </div>
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {rootCategoriesLoading && (
            <span className="text-xs text-gray-400">Đang tải...</span>
          )}
          {!rootCategoriesLoading &&
            rootCategories &&
            rootCategories.length > 0 &&
            rootCategories.map((cat: any) => (
              <Button
                key={cat.id}
                variant={
                  isItemSelected(cat.id, "category") ? "default" : "outline"
                }
                size="sm"
                className={`rounded-full px-3 py-2 text-xs font-medium border shadow-none transition-colors ${
                  isItemSelected(cat.id, "category")
                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  handleItemClick({ id: cat.id, name: cat.name }, "category")
                }
              >
                {cat.name}
              </Button>
            ))}
          {!rootCategoriesLoading &&
            (!rootCategories || rootCategories.length === 0) && (
              <span className="text-xs text-gray-400">Không có danh mục</span>
            )}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500">
          Tags
        </div>
        <div className="relative mb-3">
          <span className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center text-gray-500 pointer-events-none">
            <ScanSearch className="w-4 h-4" />
          </span>
          <Input
            placeholder="Search for tags"
            className="pl-8 h-8 text-xs rounded-full border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {(autocompleteNewsTagsLoading || tagsLoading) && (
            <span className="text-xs text-gray-400">Đang tải...</span>
          )}
          {search.trim().length > 0 &&
            autocompleteNewsTagsData &&
            autocompleteNewsTagsData.length > 0 && (
              <>
                {autocompleteNewsTagsData.map((tag: any) => (
                  <Button
                    key={tag.id}
                    variant={
                      isItemSelected(tag.id, "tag") ? "default" : "outline"
                    }
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs font-medium border shadow-none transition-colors ${
                      isItemSelected(tag.id, "tag")
                        ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      handleItemClick({ id: tag.id, name: tag.name }, "tag")
                    }
                  >
                    {tag.name}
                  </Button>
                ))}
              </>
            )}
          {search.trim().length === 0 && tags && tags.length > 0 && (
            <>
              {tags.map((tag: any) => (
                <Button
                  key={tag.id}
                  variant={
                    isItemSelected(tag.id, "tag") ? "default" : "outline"
                  }
                  size="sm"
                  className={`rounded-full px-3 py-1 text-xs font-medium border shadow-none transition-colors ${
                    isItemSelected(tag.id, "tag")
                      ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    handleItemClick({ id: tag.id, name: tag.name }, "tag")
                  }
                >
                  {tag.name}
                </Button>
              ))}
            </>
          )}
          {!tagsLoading &&
            !autocompleteNewsTagsLoading &&
            ((search.trim().length > 0 &&
              (!autocompleteNewsTagsData ||
                autocompleteNewsTagsData.length === 0)) ||
              (search.trim().length === 0 && (!tags || tags.length === 0))) && (
              <span className="text-xs text-gray-400">Không có tag nào</span>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <aside
          className={`h-[calc(100vh-4rem)] border-r transition-all duration-500 relative overflow-hidden ${
            sidebarOpen ? "w-80" : "w-12"
          }`}
          style={{
            minWidth: sidebarOpen ? 320 : 48,
            maxWidth: sidebarOpen ? 320 : 48,
          }}
        >
          <button
            className={`absolute z-20  hover:bg-gray-200 rounded-lg p-2 text-xs transition-colors flex items-center justify-center top-4 ${
              sidebarOpen ? "right-4" : "left-1/2 -translate-x-1/2"
            }`}
            onClick={() => setSidebarOpen((v) => !v)}
            type="button"
            aria-label={sidebarOpen ? "Đóng danh mục" : "Mở danh mục"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <div
            className={`transition-all duration-500 h-full p-6 pt-8 ${
              sidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ScrollArea className="h-full">
              <FilterContent />
            </ScrollArea>
          </div>
        </aside>
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle className="text-left">Filters</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-6">
                <FilterContent />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-[calc(100vh-4rem)] overflow-auto transition-all duration-300 relative">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b p-4 flex items-center gap-4">
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {selectedCategories.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0.5 text-xs"
                  >
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>

        {/* Active Filters Header */}
        {selectedCategories.length > 0 && (
          <div className="bg-white border-b p-4 sticky top-0 lg:top-0 z-20">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-semibold text-sm mr-2 hidden sm:inline">
                Active Filters:
              </span>
              <span className="font-semibold text-sm mr-2 sm:hidden">
                Filters:
              </span>
              <div className="flex flex-wrap gap-2 flex-1">
                {selectedCategories.map((item) => (
                  <Badge
                    key={`${item.type}-${item.id}`}
                    variant="outline"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium text-xs transition-colors ${
                      item.type === "category"
                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                    }`}
                  >
                    <span className="max-w-[120px] truncate">{item.name}</span>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.type)}
                      className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
                      type="button"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs rounded-full px-3 hover:bg-gray-100 ml-auto"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 lg:p-6">
          <NewsSummaryCardList posts={newsSummaryData as any} />
        </div>
      </div>
    </div>
  );
}

export default Page;
