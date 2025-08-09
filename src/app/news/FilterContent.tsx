import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/lib/modules/category";
import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { ScanSearch, Calendar as CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

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
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  // Parse and format dates for display
  const parseDateTime = (dateTime: string) => {
    if (!dateTime) return { date: undefined, time: "" };
    const parsed = parse(dateTime, "yyyy-MM-dd'T'HH:mm:ss", new Date());
    return {
      date: parsed,
      time: format(parsed, "HH:mm"),
    };
  };

  const formatDateTime = (date: Date | undefined, time: string) => {
    if (!date) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours || 0, minutes || 0, 0);
    return format(newDate, "yyyy-MM-dd'T'HH:mm:ss");
  };

  const { date: fromDate, time: fromTime } = parseDateTime(params.fromDate);
  const { date: toDate, time: toTime } = parseDateTime(params.toDate);

  const handleDateSelect = (
    type: "fromDate" | "toDate",
    selectedDate: Date | undefined
  ) => {
    const time = type === "fromDate" ? fromTime : toTime;
    const newDateTime = formatDateTime(selectedDate, time);
    onParamsChange({ [type]: newDateTime });
    if (type === "fromDate") setFromDateOpen(false);
    else setToDateOpen(false);
  };

  const handleTimeChange = (type: "fromDate" | "toDate", time: string) => {
    const date = type === "fromDate" ? fromDate : toDate;
    const newDateTime = formatDateTime(date, time);
    onParamsChange({ [type]: newDateTime });
  };

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500 flex items-center gap-2">
          Danh mục
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
          Thẻ
        </div>
        <div className="relative mb-3">
          <span className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center text-gray-500 pointer-events-none">
            <ScanSearch className="w-4 h-4" />
          </span>
          <Input
            placeholder="Tìm kiếm thẻ"
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
              <span className="text-xs text-gray-400">Không có thẻ nào</span>
            )}
        </div>
      </div>

      {/* DateTime Range Filters */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500">
          Khoảng thời gian
        </div>
        <div className="flex flex-col gap-4">
          {/* From DateTime Picker */}
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Từ ngày và giờ</label>
            <div className="flex gap-2">
              <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-xs rounded-full border-gray-200 flex items-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {fromDate ? format(fromDate, "dd/MM/yy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => handleDateSelect("fromDate", date)}
                    locale={vi}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={fromTime}
                onChange={(e) => handleTimeChange("fromDate", e.target.value)}
                className="h-8 text-xs rounded-full border-gray-200 w-24"
              />
            </div>
          </div>

          {/* To DateTime Picker */}
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Đến ngày và giờ</label>
            <div className="flex gap-2">
              <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-xs rounded-full border-gray-200 flex items-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {toDate ? format(toDate, "dd/MM/yy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => handleDateSelect("toDate", date)}
                    locale={vi}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={toTime}
                onChange={(e) => handleTimeChange("toDate", e.target.value)}
                className="h-8 text-xs rounded-full border-gray-200 w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
