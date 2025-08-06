"use client";
import { useEffect, useState, useCallback, lazy, Suspense } from "react";
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
import { ChevronLeft, ChevronRight, X, Filter, Loader2 } from "lucide-react";

import { useNewsTagList } from "@/lib/modules/newsTag/hooks/useNewsTagList";
import { useRootCategories } from "@/lib/modules/category/hooks/useRootCategories";
import { useAutocompleteNewsTags } from "@/lib/modules/newsTag/hooks/useNewsTagAutoComplete";
import { useNewsPosts } from "@/lib/modules/post/hooks/useNewsPosts";

// Lazy loading components
const NewsSummaryCardList = lazy(() =>
  import("@/components/post/NewsSummaryCardList").then((module) => ({
    default: module.NewsSummaryCardList,
  }))
);

const FilterContent = lazy(() =>
  import("./FilterContent").then((module) => ({
    default: module.FilterContent,
  }))
);

// Loading skeleton components
const CardListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
        <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const FilterSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-gray-200 h-8 rounded w-1/2"></div>
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-gray-200 h-6 rounded"></div>
      ))}
    </div>
  </div>
);

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Intersection Observer hook for infinite scrolling
function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const [elementRef, setElementRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(elementRef);
    return () => observer.disconnect();
  }, [elementRef, callback, options]);

  return setElementRef;
}

function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Lazy load hooks with enabled flags
  const [enableCategoriesQuery, setEnableCategoriesQuery] = useState(false);

  const { tags, tagsLoading } = useNewsTagList();
  const {
    autocompleteNewsTags,
    autocompleteNewsTagsLoading,
    autocompleteNewsTagsData,
  } = useAutocompleteNewsTags();
  const { rootCategories, rootCategoriesLoading } = useRootCategories(
    enableCategoriesQuery
  );

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    categoryId: "",
    tagIds: [] as string[],
    fromDate: "",
    toDate: "",
  });

  const {
    posts,
    postsLoading,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    postsFetching,
  } = useNewsPosts(params);

  const [selectedCategories, setSelectedCategories] = useState<
    {
      id: string;
      name: string;
      type: "category" | "tag";
    }[]
  >([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  // Enable queries when sidebar is opened or mobile filter is opened
  useEffect(() => {
    if (sidebarOpen || mobileFilterOpen) {
      setEnableCategoriesQuery(true);
    }
  }, [sidebarOpen, mobileFilterOpen]);

  // Infinite scroll callback
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  // Intersection observer for infinite scroll
  const loadMoreRef = useIntersectionObserver(handleLoadMore, {
    threshold: 0.1,
    rootMargin: "100px",
  });

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
      pageSize: 5,
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

  const handleParamsChange = (newParams: Partial<typeof params>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: 1,
    }));
  };

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
              <Suspense fallback={<FilterSkeleton />}>
                <FilterContent {...filterContentProps} />
              </Suspense>
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
                <Suspense fallback={<FilterSkeleton />}>
                  <FilterContent {...filterContentProps} />
                </Suspense>
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
          <Suspense fallback={<CardListSkeleton />}>
            <NewsSummaryCardList posts={posts || []} loading={postsLoading} />
          </Suspense>

          {/* Infinite Scroll Trigger and End of Content Message */}
          {hasNextPage ? (
            <div ref={loadMoreRef} className="flex justify-center py-6">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading more posts...
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={!hasNextPage}
                  className="gap-2"
                >
                  Load More Posts
                </Button>
              )}
            </div>
          ) : (
            // Show end of content message when there are no more pages and posts exist
            posts &&
            posts.length > 0 &&
            !postsLoading && (
              <div className="flex justify-center py-8">
                <div className="text-center text-gray-500">
                  <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-4"></div>
                  <p className="text-sm font-medium">
                    Bạn đã xem hết tất cả bài viết
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    Không còn nội dung để hiển thị
                  </p>
                </div>
              </div>
            )
          )}

          {/* Loading indicator for background fetching */}
          {postsFetching && !postsLoading && !isFetchingNextPage && (
            <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Refreshing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
