import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Angry,
  Frown,
  Meh,
} from "lucide-react";
import React from "react";
import { useToggleReaction } from "@/lib/modules/reaction/hooks/useToggleReaction";
import type { ReactionType } from "@/lib/modules/post/post.interface";
import { useAuthStore } from "@/lib/modules/auth/auth.store";

const REACTS: {
  type: ReactionType;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}[] = [
  { type: "like", label: "Thích", icon: ThumbsUp, color: "text-blue-500" },
  {
    type: "dislike",
    label: "Không thích",
    icon: ThumbsDown,
    color: "text-gray-500",
  },
  { type: "love", label: "Yêu thích", icon: Heart, color: "text-red-500" },
  { type: "haha", label: "Haha", icon: Laugh, color: "text-yellow-500" },
  { type: "angry", label: "Phẫn nộ", icon: Angry, color: "text-orange-500" },
  { type: "sad", label: "Buồn", icon: Frown, color: "text-blue-400" },
  { type: "meh", label: "Bình thường", icon: Meh, color: "text-gray-400" },
];

export function PostReactButton({
  postId,
  showReacts,
  handleReactMouseEnter,
  handleReactMouseLeave,
  className = "",
  userReaction,
  onReactChange,
  onReacted,
}: {
  postId: string;
  showReacts: boolean;
  handleReactMouseEnter: () => void;
  handleReactMouseLeave: () => void;
  className?: string;
  userReaction: ReactionType | "none";
  onReactChange?: (type: ReactionType) => void;
  onReacted?: () => void;
}) {
  const { setShowLoginDialog, profile } = useAuthStore();
  const { mutate: toggleReaction, isPending } = useToggleReaction(
    onReactChange
      ? {
          onSuccess: (data) => {
            onReactChange(data.data.type as ReactionType);
            if (onReacted) onReacted();
          },
        }
      : {
          onSuccess: () => {
            if (onReacted) onReacted();
          },
        }
  );

  const handleMainButton = () => {
    if (!profile) {
      setShowLoginDialog(true); // Hiển thị dialog nếu chưa đăng nhập
      return;
    }
    if (!userReaction || userReaction === "none") {
      toggleReaction({ postId, type: "like" });
    } else {
      toggleReaction({ postId, type: userReaction });
    }
  };

  const handleReactionClick = (type: ReactionType) => {
    if (!profile) {
      setShowLoginDialog(true); // Hiển thị dialog nếu chưa đăng nhập
      return;
    }
    toggleReaction({ postId, type });
    if (onReacted) onReacted();
  };

  // Nếu user đã react, lấy icon, label, màu tương ứng; nếu chưa thì mặc định
  const react = REACTS.find((r) => r.type === userReaction);
  const Icon = react ? react.icon : REACTS[0].icon;
  const color = react ? react.color : "text-foreground";
  const label = react ? react.label : REACTS[0].label;

  return (
    <div
      className={`relative flex-1 ${className}`}
      onMouseEnter={handleReactMouseEnter}
      onMouseLeave={handleReactMouseLeave}
    >
      <Button
        variant="ghost"
        size="lg"
        className={`w-full justify-center flex-1 rounded ${color} hover:${color}`}
        onClick={handleMainButton}
        disabled={isPending}
      >
        <Icon className={`h-5 w-5 ${color}`} /> {label}
      </Button>
      {/* React popup */}
      {showReacts && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex gap-1 bg-background border rounded-xl shadow-lg p-2 z-10 animate-in fade-in">
          {REACTS.map((r) => {
            const Icon = r.icon;
            return (
              <Button
                key={r.type}
                variant="ghost"
                size="icon"
                title={r.label}
                onClick={() => handleReactionClick(r.type)}
                disabled={isPending}
              >
                <Icon className={`h-5 w-5 ${r.color}`} />
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
