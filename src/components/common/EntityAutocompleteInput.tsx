import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAutocompleteCategories } from "@/lib/modules/category/hooks/useAutocompleteCategories";
import { Category } from "@/lib/modules/category";
import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { Search, Image as ImageIcon, Tag as TagIcon } from "lucide-react";
import Image from "next/image";
import { useAutocompleteNewsTags } from "@/lib/modules/newsTag/hooks/useNewsTagAutoComplete";
import { useUserNewsPostSearch } from "@/lib/modules/post/hooks/useUserNewsPostSearch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  console.log(
    "🔍 ~  ~ src/components/common/EntityAutocompleteInput.tsx:23 ~ showDropdown:",
    showDropdown
  );

  const [displayedCategories, setDisplayedCategories] = useState<Category[]>(
    []
  );
  const [displayedTags, setDisplayedTags] = useState<NewsTag[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchParams = useSearchParams();

  const { autocompleteCategories, autocompleteCategoriesData } =
    useAutocompleteCategories();
  const { autocompleteNewsTags, autocompleteNewsTagsData } =
    useAutocompleteNewsTags();
  const { data: autocompleteNewsPostsData } = useUserNewsPostSearch(
    value.trim(),
    !!value.trim()
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setDisplayedCategories([]);
      setDisplayedTags([]);
      setShowDropdown(false); // Thêm dòng này để đóng dropdown khi input trống
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

  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasCategories = displayedCategories.length > 0;
  const hasTags = displayedTags.length > 0;
  const hasNewsPosts =
    autocompleteNewsPostsData && autocompleteNewsPostsData.length > 0;
  const hasAnyGroup = hasCategories || hasTags || hasNewsPosts;

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleSelectCategory = (category: Category) => {
    setValue(category.name);
    onSelectCategory?.(category);
    closeDropdown(); // Đảm bảo đóng dropdown sau khi chọn
  };

  const handleSelectTag = (tag: NewsTag) => {
    setValue(tag.name);
    onSelectTag?.(tag);
    closeDropdown(); // Đảm bảo đóng dropdown sau khi chọn
  };

  const handleLinkClick = () => {
    closeDropdown();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto" ref={wrapperRef}>
      <div className="flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-10"
          placeholder={placeholder || "Tìm kiếm danh mục, thẻ hoặc bài viết..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => value && setShowDropdown(true)}
          autoComplete="off"
        />
      </div>
      {showDropdown && value && (
        <div className="absolute z-20 mt-1 w-full bg-popover border rounded shadow-lg max-h-[500px] overflow-hidden animate-in fade-in flex">
          {hasAnyGroup ? (
            <>
              {/* Left Column for Categories and Tags */}
              <div
                className={`flex-grow overflow-y-auto ${
                  hasNewsPosts ? "w-1/3" : "w-full"
                } max-h-[500px]`}
              >
                {hasCategories || hasTags ? (
                  <>
                    {/* Group: Danh mục */}
                    {hasCategories && (
                      <>
                        <div className="sticky top-0 z-10 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                          Danh mục
                        </div>
                        {displayedCategories.map((cat) => {
                          const currentParams = new URLSearchParams(
                            searchParams.toString()
                          );
                          currentParams.set("categoryId", cat.id);
                          currentParams.delete("page");
                          const categoryLink = `/news/?${currentParams.toString()}`;

                          return (
                            <Link
                              key={`category-${cat.id}`}
                              href={categoryLink}
                              onClick={() => {
                                handleSelectCategory(cat);
                              }}
                              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent border-b border-gray-100"
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
                                <span className="font-medium truncate">
                                  {cat.name}
                                </span>
                                {cat.description && (
                                  <span className="text-xs text-muted-foreground truncate">
                                    {cat.description}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </>
                    )}
                    {/* Group: Thẻ */}
                    {hasTags && (
                      <>
                        <div className="sticky top-0 z-10 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-gray-50 border-b border-gray-200 mt-4">
                          Tags
                        </div>
                        {displayedTags.map((tag) => {
                          const currentParams = new URLSearchParams(
                            searchParams.toString()
                          );
                          const existingTags = currentParams.getAll("tagIds");

                          if (existingTags.includes(tag.id)) {
                            const newTags = existingTags.filter(
                              (id) => id !== tag.id
                            );
                            currentParams.delete("tagIds");
                            newTags.forEach((id) =>
                              currentParams.append("tagIds", id)
                            );
                          } else {
                            currentParams.append("tagIds", tag.id);
                          }
                          currentParams.delete("page");

                          const tagLink = `/news/?${currentParams.toString()}`;

                          return (
                            <Link
                              key={`tag-${tag.id}`}
                              href={tagLink}
                              onClick={() => {
                                handleSelectTag(tag);
                              }}
                              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent border-b border-gray-100"
                            >
                              <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg">
                                <TagIcon className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium truncate">
                                  {tag.name}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Không tìm thấy danh mục hoặc thẻ phù hợp.
                  </div>
                )}
              </div>
              {/* Right Column for News Posts */}
              {hasNewsPosts && (
                <div className="flex-grow w-2/3 overflow-y-auto border-l border-gray-200 max-h-[500px]">
                  <div className="sticky top-0 z-10 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                    Bài viết
                  </div>
                  {autocompleteNewsPostsData.map((news) => (
                    <Link
                      key={`news-${news.id}`}
                      href={`/news/${news.slug}`}
                      passHref
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent border-b border-gray-100"
                    >
                      {news.cover_image ? (
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={news.cover_image}
                            alt={news.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg">
                          <Search className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">
                          {news.title}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {news.summary}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-4 w-full text-center text-muted-foreground text-sm">
              Không tìm thấy danh mục, thẻ hoặc bài viết phù hợp.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
