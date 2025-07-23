"use client";
import { useEffect, useState } from "react";
import { NewsSummaryCardList } from "@/components/post/NewsSummaryCardList";
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
import { ChevronLeft, ChevronRight, X, Filter } from "lucide-react";

import { useNewsTagList } from "@/lib/modules/newsTag/hooks/useNewsTagList";
import { useRootCategories } from "@/lib/modules/category/hooks/useRootCategories";
import { useAutocompleteNewsTags } from "@/lib/modules/newsTag/hooks/useNewsTagAutoComplete";
import { useNewsPosts } from "@/lib/modules/post/hooks/useNewsPosts";
import { FilterContent } from "./FilterContent";

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

  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
    categoryId: "",
    tagIds: [] as string[],
    fromDate: "",
    toDate: "",
  });

  const { posts, postsLoading } = useNewsPosts(params);

  const [selectedCategories, setSelectedCategories] = useState<
    {
      id: string;
      name: string;
      type: "category" | "tag";
    }[]
  >([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      categoryId:
        selectedCategories.find((item) => item.type === "category")?.id || "",
      tagIds: selectedCategories
        .filter((item) => item.type === "tag")
        .map((item) => item.id),
      page: 1,
    }));
  }, [selectedCategories]);

  const handleItemClick = (
    item: { id: string; name: string },
    type: "category" | "tag"
  ) => {
    setSelectedCategories((prev) => {
      const exists = prev.find(
        (cat) => cat.id === item.id && cat.type === type
      );
      if (exists) {
        return prev.filter((cat) => !(cat.id === item.id && cat.type === type));
      } else {
        if (type === "category") {
          return [
            ...prev.filter((cat) => cat.type !== "category"),
            { ...item, type },
          ];
        }
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
    setParams({
      page: 1,
      pageSize: 20,
      categoryId: "",
      tagIds: [],
      fromDate: "",
      toDate: "",
    });
    setSearch("");
  };

  const isItemSelected = (id: string, type: "category" | "tag") => {
    return selectedCategories.some((cat) => cat.id === id && cat.type === type);
  };

  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      autocompleteNewsTags(debouncedSearch);
    }
  }, [debouncedSearch, autocompleteNewsTags]);

  // ✅ 2. Tạo một hàm xử lý chung cho việc thay đổi params ngày tháng
  const handleParamsChange = (newParams: Partial<typeof params>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: 1,
    }));
  };

  // ❌ Định nghĩa FilterContent đã được xóa khỏi đây và chuyển ra file riêng.

  // ✅ 3. Gom tất cả props cho FilterContent vào một object để tái sử dụng
  const filterContentProps = {
    rootCategories,
    rootCategoriesLoading,
    tags,
    tagsLoading,
    autocompleteNewsTagsData,
    autocompleteNewsTagsLoading,
    search,
    onSearchChange: setSearch,
    isItemSelected,
    onItemClick: handleItemClick,
    params,
    onParamsChange: handleParamsChange,
  };

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
            className={`absolute z-20 hover:bg-gray-200 rounded-lg p-2 text-xs transition-colors flex items-center justify-center top-4 ${
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
              {/* ✅ 4. Sử dụng FilterContent và truyền props vào */}
              <FilterContent {...filterContentProps} />
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
                {/* ✅ 4. Sử dụng FilterContent và truyền props vào */}
                <FilterContent {...filterContentProps} />
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
        {(selectedCategories.length > 0 ||
          params.fromDate ||
          params.toDate) && (
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
                {params.fromDate && (
                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  >
                    <span className="max-w-[120px] truncate">
                      From: {new Date(params.fromDate).toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          fromDate: "",
                          page: 1,
                        }))
                      }
                      className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
                      type="button"
                      aria-label="Remove From Date"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {params.toDate && (
                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  >
                    <span className="max-w-[120px] truncate">
                      To: {new Date(params.toDate).toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        setParams((prev) => ({ ...prev, toDate: "", page: 1 }))
                      }
                      className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
                      type="button"
                      aria-label="Remove To Date"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
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
          <NewsSummaryCardList posts={posts || []} loading={postsLoading} />
        </div>
      </div>
    </div>
  );
}

export default Page;
