"use client";
import { useEffect, useState } from "react";
import { NewsSummaryCardList } from "@/components/post/NewsSummaryCardList";
import newsSummaryData from "@/lib/modules/post/news.summary.temp.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScanSearch, ChevronLeft, ChevronRight } from "lucide-react";
import { useNewsTagList } from "@/lib/modules/newsTag/hooks/useNewsTagList";
import { useAutocompleteNewsTags } from "@/lib/modules/newsTag/hooks/useNewsTagAutoComplete";
import { useRootCategories } from "@/lib/modules/category/hooks/useRootCategories";

// Xoá biến categories vì đã dùng tags động từ API

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
  const { tags, tagsLoading } = useNewsTagList();
  const {
    autocompleteNewsTags,
    autocompleteNewsTagsLoading,
    autocompleteNewsTagsData,
  } = useAutocompleteNewsTags();
  const { rootCategories, rootCategoriesLoading } = useRootCategories();
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const handleCategoryClick = (cat: { id: string; name: string }) => {
    setSelectedCategory(cat);
  };
  const handleClear = () => {
    setSelectedCategory(null);
  };

  // Xử lý search input
  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      autocompleteNewsTags(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="h-full flex">
      {sidebarOpen && (
        <aside className="w-1/4 h-[calc(100vh-4rem)] overflow-auto border-r bg-white p-4 transition-all duration-300 relative">
          <button
            className="absolute right-2 top-2 z-10 bg-gray-100 border rounded px-2 py-1 text-xs hover:bg-gray-200 flex items-center justify-center"
            onClick={() => setSidebarOpen(false)}
            type="button"
            aria-label="Đóng danh mục"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 flex items-center gap-2">
              Category
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
                      selectedCategory?.id === cat.id ? "default" : "outline"
                    }
                    size="sm"
                    className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                      selectedCategory?.id === cat.id
                        ? "bg-black text-white"
                        : ""
                    }`}
                    onClick={() =>
                      handleCategoryClick({ id: cat.id, name: cat.name })
                    }
                  >
                    {cat.name}
                  </Button>
                ))}
              {!rootCategoriesLoading &&
                (!rootCategories || rootCategories.length === 0) && (
                  <span className="text-xs text-gray-400">
                    Không có danh mục
                  </span>
                )}
            </div>
          </div>
          <div className="mb-2">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">
              Tags
            </div>
            <div className="relative mb-2">
              <span className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center text-[#78716B] pointer-events-none">
                <ScanSearch className="w-5 h-5" />
              </span>
              <Input
                placeholder="Search for tags"
                className="pl-8 h-8 text-xs"
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
                          selectedCategory?.id === tag.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className={`rounded-xl px-3 py-1 text-xs font-semibold ${
                          selectedCategory?.id === tag.id
                            ? "bg-black text-white"
                            : ""
                        }`}
                        onClick={() =>
                          handleCategoryClick({ id: tag.id, name: tag.name })
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
                        selectedCategory?.id === tag.id ? "default" : "outline"
                      }
                      size="sm"
                      className={`rounded-xl px-3 py-1 text-xs font-semibold ${
                        selectedCategory?.id === tag.id
                          ? "bg-black text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleCategoryClick({ id: tag.id, name: tag.name })
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
                  (search.trim().length === 0 &&
                    (!tags || tags.length === 0))) && (
                  <span className="text-xs text-gray-400">
                    Không có tag nào
                  </span>
                )}
            </div>
          </div>
        </aside>
      )}
      <div
        className={`${
          sidebarOpen ? "w-3/4" : "w-full"
        } h-[calc(100vh-4rem)] overflow-auto bg-gray-100 p-4 transition-all duration-300 relative`}
      >
        {!sidebarOpen && (
          <button
            className="absolute left-2 top-2 z-10 bg-gray-100 border rounded px-2 py-1 text-xs hover:bg-gray-200 flex items-center justify-center"
            onClick={() => setSidebarOpen(true)}
            type="button"
            aria-label="Mở danh mục"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <NewsSummaryCardList posts={newsSummaryData as any} />
      </div>
    </div>
  );
}

export default Page;
