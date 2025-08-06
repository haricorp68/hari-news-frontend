import { NewsTag } from "@/lib/modules/newsTag/newsTag.interface";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TagAutoCompleteInput } from "@/components/tag/TagAutoCompleteInput";

interface TagsInputProps {
  tags: NewsTag[];
  onTagSelect: (tag: NewsTag) => void;
  onRemoveTag: (tagId: string) => void;
}

export function TagsInput({ tags, onTagSelect, onRemoveTag }: TagsInputProps) {
  return (
    <div className="flex-1 space-y-2">
      <Label>Thẻ *</Label>
      <TagAutoCompleteInput
        onSelectTag={onTagSelect}
        placeholder="Tìm kiếm thẻ..."
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="cursor-pointer hover:bg-red-100"
              onClick={() => onRemoveTag(tag.id)}
            >
              {tag.name}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
