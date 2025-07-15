import ReactionIcons, { ReactionType } from "@/components/ui/reaction-icons";

export function PostStatsBar({
  reactionSummary,
  commentCount,
}: {
  reactionSummary: any;
  commentCount: number;
}) {
  const values = Object.values(reactionSummary || {}) as number[];
  return (
    <div className="flex gap-4 text-xs text-muted-foreground items-center justify-between">
      {/* Hiển thị các icon cảm xúc đã được sử dụng */}
      {values.some((v) => v && v > 0) && (
        <span className="flex items-center">
          <ReactionIcons
            reactions={
              (Object.entries(reactionSummary || {}) as [string, number][])
                .filter((entry) => entry[1] && entry[1] > 0)
                .map((entry) => entry[0]) as ReactionType[]
            }
          />
          <span className="ml-1 font-medium text-xs text-foreground">
            {values.reduce((a, b) => (a || 0) + (b || 0), 0)}
          </span>
        </span>
      )}
      <span className="flex-1"></span>
      <span className="text-right min-w-fit">
        {commentCount || 0} bình luận
      </span>
    </div>
  );
} 