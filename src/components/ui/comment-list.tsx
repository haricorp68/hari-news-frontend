import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRepliesByParentId } from "@/lib/modules/comment/hooks/useRepliesByParentId";
import { formatRelativeTime, formatFullTime } from "@/utils/formatTime";
import { UserProfileLink } from "@/components/ui/user-profile-link";
import Image from "next/image";

interface CommentListProps {
  comments: any[];
}

export function CommentList({ comments }: CommentListProps) {
  // Hàm scroll đến comment cha
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(`comment-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <div className="flex flex-col gap-4">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          c={c}
          level={0}
          parentUser={undefined}
          parentId={undefined}
          onScrollTo={handleScrollTo}
        />
      ))}
    </div>
  );
}

interface CommentItemProps {
  c: any;
  level: number;
  parentUser?: string;
  parentId?: string;
  onScrollTo?: (id: string) => void;
}

function CommentItem({
  c,
  level,
  parentUser,
  parentId,
  onScrollTo,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const { replies, repliesLoading } = useRepliesByParentId(
    showReplies ? c.id : undefined,
    showReplies
  );
  // Chỉ lùi ở cấp 1
  const indentClass = level === 1 ? "pl-8 border-l border-muted" : "";

  return (
    <div
      id={`comment-${c.id}`}
      className={`flex gap-3 items-start flex-col ${indentClass}`.trim()}
    >
      <div className="flex flex-row w-full gap-1">
        <UserProfileLink
          user={c.user}
          avatarOnly
          className="flex items-start"
        />
        <div className="flex-1">
          <div className="flex flex-row flex-wrap items-start gap-x-1 text-sm mt-2">
            <UserProfileLink
              user={c.user}
              className="font-semibold hover:underline cursor-pointer"
            />
            {parentUser && parentId && (
              <button
                type="button"
                className="text-comment-mention font-semibold hover:underline cursor-pointer"
                onClick={() => onScrollTo && onScrollTo(parentId)}
              >
                @{parentUser}
              </button>
            )}
            <span className="break-words break-all whitespace-pre-line max-w-full block">
              {c.content}
            </span>
          </div>
          {/* Media grid */}
          {c.media && c.media.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {c.media.map((m: any, idx: number) =>
                m.type.startsWith("image") ? (
                  <Image
                    key={idx}
                    src={m.url}
                    alt="media"
                    width={400}
                    height={300}
                    className="w-full h-40 object-cover rounded-lg bg-black"
                  />
                ) : (
                  <video
                    key={idx}
                    src={m.url}
                    controls
                    className="w-full h-40 object-cover rounded-lg bg-black"
                  />
                )
              )}
            </div>
          )}
          <div className="flex gap-4 mt-1 text-xs text-muted-foreground items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{formatRelativeTime(c.created_at)}</span>
                </TooltipTrigger>
                <TooltipContent>{formatFullTime(c.created_at)}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button
              type="button"
              className="hover:underline focus:outline-none font-semibold text-foreground cursor-pointer"
            >
              Trả lời
            </button>
          </div>
          {c.childCount > 0 && (
            <button
              type="button"
              className="ml-2 mt-1 text-xs font-semibold text-primary hover:underline focus:outline-none cursor-pointer"
              onClick={() => setShowReplies((v) => !v)}
            >
              {showReplies
                ? "Ẩn câu trả lời"
                : `Xem câu trả lời (${c.childCount})`}
            </button>
          )}
        </div>
      </div>
      {/* Replies (đệ quy) */}
      {showReplies && (
        <div className="mt-2 w-full">
          {repliesLoading ? (
            <div className="text-xs text-muted-foreground py-2">
              Đang tải...
            </div>
          ) : replies && replies.length > 0 ? (
            <div className="flex flex-col gap-3">
              {replies.map((r: any) => (
                <CommentItem
                  key={r.id}
                  c={r}
                  level={level + 1}
                  parentUser={c.user.name}
                  parentId={c.id}
                  onScrollTo={onScrollTo}
                />
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground py-2">
              Chưa có câu trả lời.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
