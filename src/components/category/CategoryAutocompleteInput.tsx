import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAutocompleteCategories } from "@/lib/modules/category/hooks/useAutocompleteCategories";
import { Category } from "@/lib/modules/category";
import { Search, Image as ImageIcon } from "lucide-react";

interface CategoryAutocompleteInputProps {
  onSelect?: (category: Category) => void;
  placeholder?: string;
}

export const CategoryAutocompleteInput: React.FC<CategoryAutocompleteInputProps> = ({ onSelect, placeholder }) => {
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayedData, setDisplayedData] = useState<Category[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { autocompleteCategories, autocompleteCategoriesData } = useAutocompleteCategories();

  // Debounce autocomplete
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setDisplayedData([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      autocompleteCategories({ q: value.trim() });
      setShowDropdown(true);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, autocompleteCategories]);

  // Cập nhật displayedData khi có data mới
  useEffect(() => {
    if (autocompleteCategoriesData) {
      setDisplayedData(autocompleteCategoriesData);
    }
  }, [autocompleteCategoriesData]);

  // Đóng dropdown khi click ngoài
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-10"
          placeholder={placeholder || "Tìm kiếm danh mục..."}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => value && setShowDropdown(true)}
          autoComplete="off"
        />
      </div>
      {showDropdown && value && (
        <div className="absolute z-20 mt-1 w-full bg-popover border rounded shadow-lg max-h-60 overflow-auto animate-in fade-in">
          {/* Group: Danh mục */}
          <div className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Danh mục</div>
          {displayedData.length > 0 ? (
            displayedData.map(cat => (
              <div
                key={cat.id}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-accent"
                onClick={() => {
                  setValue(cat.name);
                  setShowDropdown(false);
                  onSelect?.(cat);
                }}
              >
                {cat.coverImage ? (
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{cat.name}</span>
                  {cat.description && (
                    <span className="text-xs text-muted-foreground truncate">{cat.description}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">Không tìm thấy danh mục phù hợp.</div>
          )}
          <div className="my-1 border-t" />
        </div>
      )}
    </div>
  );
}; 