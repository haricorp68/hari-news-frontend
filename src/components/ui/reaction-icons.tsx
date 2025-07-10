import React from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
  Laugh,
  Angry,
  Frown,
  Meh,
} from "lucide-react";

export type ReactionType =
  | "like"
  | "dislike"
  | "love"
  | "haha"
  | "angry"
  | "sad"
  | "meh";

interface ReactionIconsProps {
  reactions?: ReactionType[];
  className?: string;
}

const iconMap: Record<
  ReactionType,
  { icon: React.ElementType; bgColor: string }
> = {
  like: { icon: ThumbsUp, bgColor: "bg-blue-500" },
  dislike: { icon: ThumbsDown, bgColor: "bg-gray-500" },
  love: { icon: Heart, bgColor: "bg-red-500" },
  haha: { icon: Laugh, bgColor: "bg-yellow-500" },
  angry: { icon: Angry, bgColor: "bg-orange-500" },
  sad: { icon: Frown, bgColor: "bg-blue-400" },
  meh: { icon: Meh, bgColor: "bg-gray-400" },
};

const ReactionIcons: React.FC<ReactionIconsProps> = ({
  reactions = [],
  className,
}) => {
  // Chỉ lấy tối đa 3 icon đầu tiên
  const displayedReactions = reactions.slice(0, 3);

  if (displayedReactions.length === 0) {
    return null;
  }

  return (
    <div className={"flex items-center " + (className || "")}>
      <div className="flex items-center relative">
        {displayedReactions.map((reactionType, index) => {
          const reaction = iconMap[reactionType as ReactionType];
          if (!reaction) return null;
          const IconComponent = reaction.icon;
          return (
            <div
              key={index}
              className={`
                w-5 h-5 rounded-full ${reaction.bgColor}
                flex items-center justify-center
                border-2 border-white
                ${index > 0 ? "-ml-2" : ""}
                relative
                shadow-sm
              `}
              style={{ zIndex: displayedReactions.length - index }}
            >
              <IconComponent
                size={10}
                className="text-white"
                strokeWidth={2.5}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReactionIcons;
