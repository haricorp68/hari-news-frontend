import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/lib/modules/category";
import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { ScanSearch } from "lucide-react";
// Giả sử bạn có thể import các type này, nếu không có thể dùng any[] | undefined

// ✅ Sửa lỗi: Cho phép các props có thể là undefined
type FilterContentProps = {
  rootCategories: Category[] | undefined;
  rootCategoriesLoading: boolean;
  tags: NewsTag[] | undefined;
  tagsLoading: boolean;
  autocompleteNewsTagsData: NewsTag[] | undefined;
  autocompleteNewsTagsLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  isItemSelected: (id: string, type: "category" | "tag") => boolean;
  onItemClick: (
    item: { id: string; name: string },
    type: "category" | "tag"
  ) => void;
  params: { fromDate: string; toDate: string };
  onParamsChange: (
    newParams: Partial<{ fromDate: string; toDate: string }>
  ) => void;
};

export function FilterContent({
  rootCategories,
  rootCategoriesLoading,
  tags,
  tagsLoading,
  autocompleteNewsTagsData,
  autocompleteNewsTagsLoading,
  search,
  onSearchChange,
  isItemSelected,
  onItemClick,
  params,
  onParamsChange,
}: FilterContentProps) {
  // Phần JSX bên dưới không cần thay đổi
  return (
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
            rootCategories?.map((cat) => (
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
                  onItemClick({ id: cat.id, name: cat.name }, "category")
                }
              >
                {cat.name}
              </Button>
            ))}
          {!rootCategoriesLoading && !rootCategories?.length && (
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {(autocompleteNewsTagsLoading || tagsLoading) && (
            <span className="text-xs text-gray-400">Đang tải...</span>
          )}
          {search.trim().length > 0 &&
            autocompleteNewsTagsData?.map((tag) => (
              <Button
                key={tag.id}
                variant={isItemSelected(tag.id, "tag") ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-3 py-1 text-xs font-medium border shadow-none transition-colors ${
                  isItemSelected(tag.id, "tag")
                    ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  onItemClick({ id: tag.id, name: tag.name }, "tag")
                }
              >
                {tag.name}
              </Button>
            ))}
          {search.trim().length === 0 &&
            tags?.map((tag) => (
              <Button
                key={tag.id}
                variant={isItemSelected(tag.id, "tag") ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-3 py-1 text-xs font-medium border shadow-none transition-colors ${
                  isItemSelected(tag.id, "tag")
                    ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  onItemClick({ id: tag.id, name: tag.name }, "tag")
                }
              >
                {tag.name}
              </Button>
            ))}
          {!tagsLoading &&
            !autocompleteNewsTagsLoading &&
            ((search.trim().length > 0 && !autocompleteNewsTagsData?.length) ||
              (search.trim().length === 0 && !tags?.length)) && (
              <span className="text-xs text-gray-400">Không có tag nào</span>
            )}
        </div>
      </div>

      {/* DateTime Range Filters */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500">
          Date & Time Range
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="fromDate" className="text-xs font-medium mb-1">
              From Date & Time
            </label>
            <Input
              id="fromDate"
              type="datetime-local"
              value={params.fromDate}
              onChange={(e) => onParamsChange({ fromDate: e.target.value })}
              className="h-8 text-xs rounded-full border-gray-200"
              step="1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="toDate" className="text-xs font-medium mb-1">
              To Date & Time
            </label>
            <Input
              id="toDate"
              type="datetime-local"
              value={params.toDate}
              onChange={(e) => onParamsChange({ toDate: e.target.value })}
              className="h-8 text-xs rounded-full border-gray-200"
              step="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
