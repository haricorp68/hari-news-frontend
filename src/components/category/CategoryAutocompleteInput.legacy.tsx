import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAutocompleteCategories } from "@/lib/modules/category/hooks/useAutocompleteCategories";
import { Category } from "@/lib/modules/category";
import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { Search, Image as ImageIcon, Tag as TagIcon } from "lucide-react";
import Image from "next/image";
import { useAutocompleteNewsTags } from "@/lib/modules/newsTag/hooks/useNewsTagAutoComplete";

interface EntityAutocompleteInputProps {
  onSelectCategory?: (category: Category) => void;
  onSelectTag?: (tag: NewsTag) => void;
  placeholder?: string;
}

export const EntityAutocompleteInput: React.FC<
  EntityAutocompleteInputProps
> = ({ onSelectCategory, onSelectTag, placeholder }) => {
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>(
    []
  );
  const [displayedTags, setDisplayedTags] = useState<NewsTag[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { autocompleteCategories, autocompleteCategoriesData } =
    useAutocompleteCategories();
  const { autocompleteNewsTags, autocompleteNewsTagsData } =
    useAutocompleteNewsTags();

  // Debounce autocomplete for both categories and tags
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setDisplayedCategories([]);
      setDisplayedTags([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      autocompleteCategories({ q: value.trim() });
      autocompleteNewsTags(value.trim());
      setShowDropdown(true);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, autocompleteCategories, autocompleteNewsTags]);

  // Update displayed data when new data is received
  useEffect(() => {
    if (autocompleteCategoriesData) {
      setDisplayedCategories(autocompleteCategoriesData);
    }
  }, [autocompleteCategoriesData]);

  useEffect(() => {
    if (autocompleteNewsTagsData) {
      setDisplayedTags(autocompleteNewsTagsData);
    }
  }, [autocompleteNewsTagsData]);

  // Close dropdown when clicking outside
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show divider if both categories and tags are present
  const hasBothGroups =
    displayedCategories.length > 0 && displayedTags.length > 0;

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-10"
          placeholder={placeholder || "Tìm kiếm danh mục hoặc thẻ..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => value && setShowDropdown(true)}
          autoComplete="off"
        />
      </div>
      {showDropdown && value && (
        <div className="absolute z-20 mt-1 w-full bg-popover border rounded shadow-lg max-h-80 overflow-auto animate-in fade-in">
          {/* Group: Danh mục */}
          {displayedCategories.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-gray-50">
                Danh mục
              </div>
              {displayedCategories.map((cat) => (
                <div
                  key={`category-${cat.id}`}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-accent border-l-4 border-blue-500"
                  onClick={() => {
                    setValue(cat.name);
                    setShowDropdown(false);
                    onSelectCategory?.(cat);
                  }}
                >
                  {cat.coverImage ? (
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={cat.coverImage}
                        alt={cat.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{cat.name}</span>
                    {cat.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {cat.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {hasBothGroups && <div className=" border-t border-gray-200" />}

          {/* Group: Thẻ */}
          {displayedTags.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-gray-50">
                Tags
              </div>
              {displayedTags.map((tag) => (
                <div
                  key={`tag-${tag.id}`}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-accent border-l-4 border-green-500"
                  onClick={() => {
                    setValue(tag.name);
                    setShowDropdown(false);
                    onSelectTag?.(tag);
                  }}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg">
                    <TagIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{tag.name}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {displayedCategories.length === 0 && displayedTags.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Không tìm thấy danh mục hoặc thẻ phù hợp.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
