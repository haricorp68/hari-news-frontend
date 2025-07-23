"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCommentList } from "@/lib/modules/comment/hooks/useCommentList";
import { useCreateComment } from "@/lib/modules/comment/hooks/useCreateComment";
import type {
  ReactionSummary,
  ReactionType,
} from "@/lib/modules/post/post.interface";

import { PostStatsBar } from "../post/PostStatsBar";
import { PostReactButton } from "../post/PostReactButton";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CommentList } from "../ui/comment-list";

interface NewsDetailFooterProps {
  post: {
    id: string;
    reactionSummary?: ReactionSummary;
    commentCount?: number;
    userReaction?: ReactionType;
  };
}

export function NewsDetailFooter({ post }: NewsDetailFooterProps) {
  const queryClient = useQueryClient();
  const { comments, commentsLoading, refetchComments } = useCommentList(
    post.id,
    true
  );
  const { createComment, createCommentLoading } = useCreateComment();
  const [content, setContent] = useState("");

  // Reaction state
  const [showReacts, setShowReacts] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [userReaction, setUserReaction] = useState<ReactionType | "none">(
    post.userReaction ?? "none"
  );

  useEffect(() => {
    setUserReaction(post.userReaction ?? "none");
  }, [post.userReaction, post.id]);

  const handleReactMouseEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    hoverTimeout.current = setTimeout(() => setShowReacts(true), 500);
  };

  const handleReactMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    leaveTimeout.current = setTimeout(() => setShowReacts(false), 500);
  };

  const handleReacted = () => {
    setShowReacts(false);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    queryClient.invalidateQueries({
      queryKey: ["userNewsPostDetail", post.id],
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment(
      { postId: post.id, content },
      {
        onSuccess: () => {
          setContent("");
          refetchComments();
          queryClient.invalidateQueries({
            queryKey: ["userNewsPostDetail", post.id],
          });
        },
      }
    );
  };

  return (
    <div className="mt-8">
      {/* Stats Bar */}
      <div className="my-2">
        <PostStatsBar
          reactionSummary={post.reactionSummary}
          commentCount={post.commentCount ?? 0}
        />
      </div>
      {/* Action Buttons */}
      <form
        onSubmit={handleSubmitComment}
        className="py-2 flex gap-2 items-start flex-row"
      >
        <PostReactButton
          postId={post.id}
          userReaction={userReaction}
          showReacts={showReacts}
          handleReactMouseEnter={handleReactMouseEnter}
          handleReactMouseLeave={handleReactMouseLeave}
          className="border rounded w-auto min-w-0"
          onReactChange={(type) => {
            setUserReaction(type);
            queryClient.invalidateQueries({
              queryKey: ["userNewsPostDetail", post.id],
            });
          }}
          onReacted={handleReacted}
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận..."
          className="flex-1 min-h-10 max-h-40"
          rows={1}
          disabled={createCommentLoading}
        />
        <Button
          type="submit"
          disabled={createCommentLoading || !content.trim()}
          className="mt-1"
        >
          Gửi
        </Button>
      </form>

      {/* Comment List */}
      <div className="mt-4 border-r border-l p-4">
        <p className="text-sm font-semibold mb-2">Bình luận</p>
        {commentsLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Đang tải bình luận...
          </div>
        ) : comments && comments.length > 0 ? (
          <CommentList comments={comments} />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Chưa có bình luận nào.
          </div>
        )}
      </div>
    </div>
  );
}
