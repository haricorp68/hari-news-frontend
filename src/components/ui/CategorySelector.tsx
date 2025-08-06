import { useCategory } from "@/lib/modules/category/useCategory";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface CategorySelectorProps {
  categoryId: string;
  setCategoryId: (value: string) => void;
}

export function CategorySelector({
  categoryId,
  setCategoryId,
}: CategorySelectorProps) {
  const { rootCategories, rootCategoriesLoading } = useCategory(undefined, {
    enabledRoot: true,
  });

  return (
    <div className="flex-1 space-y-2">
      <Label>Danh mục *</Label>
      {rootCategoriesLoading ? (
        <Skeleton className="w-full h-10 bg-gray-200 animate-pulse rounded-lg" />
      ) : (
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger className="w-full border border-gray-300 rounded-lg focus:outline-none">
            <SelectValue placeholder="Chọn danh mục">
              {categoryId && rootCategories
                ? rootCategories.find((cat) => cat.id === categoryId)?.name ||
                  "Danh mục không tồn tại"
                : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {rootCategories && rootCategories.length > 0 ? (
              rootCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-categories" disabled>
                Không có danh mục
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
      {categoryId &&
        rootCategories &&
        !rootCategoriesLoading &&
        !rootCategories.find((cat) => cat.id === categoryId) && (
          <p className="text-sm text-amber-600">
            ⚠️ Danh mục đã chọn không còn tồn tại. Vui lòng chọn danh mục khác.
          </p>
        )}
    </div>
  );
}
