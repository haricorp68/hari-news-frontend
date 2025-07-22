import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAutocompleteNewsTags } from "@/lib/modules/newsTag/hooks/useNewsTagAutoComplete";
import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { Search, Tag as TagIcon } from "lucide-react";

interface TagAutoCompleteInputProps {
  onSelectTag?: (tag: NewsTag) => void;
  placeholder?: string;
}

export const TagAutoCompleteInput: React.FC<TagAutoCompleteInputProps> = ({
  onSelectTag,
  placeholder,
}) => {
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayedTags, setDisplayedTags] = useState<NewsTag[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { autocompleteNewsTags, autocompleteNewsTagsData } =
    useAutocompleteNewsTags();

  // Debounce autocomplete for tags
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setDisplayedTags([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      autocompleteNewsTags(value.trim());
      setShowDropdown(true);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, autocompleteNewsTags]);

  // Update displayed data when new data is received
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

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-10"
          placeholder={placeholder || "Tìm kiếm thẻ..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => value && setShowDropdown(true)}
          autoComplete="off"
        />
      </div>
      {showDropdown && value && (
        <div className="absolute z-20 mt-1 w-full bg-popover border rounded shadow-lg max-h-80 overflow-auto animate-in fade-in">
          {displayedTags.length > 0 ? (
            <>
              {displayedTags.map((tag) => (
                <div
                  key={`tag-${tag.id}`}
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setValue("");
                    setShowDropdown(false);
                    onSelectTag?.(tag);
                  }}
                >
                  <TagIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-normal truncate">
                    {tag.name}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="p-3 text-center text-muted-foreground text-xs">
              Không tìm thấy thẻ phù hợp.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
