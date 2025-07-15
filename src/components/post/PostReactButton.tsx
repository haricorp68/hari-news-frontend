import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import React from "react";

export function PostReactButton({ showReacts, handleReactMouseEnter, handleReactMouseLeave, REACTS, className = "" }: {
  showReacts: boolean;
  handleReactMouseEnter: () => void;
  handleReactMouseLeave: () => void;
  REACTS: any[];
  className?: string;
}) {
  return (
    <div
      className={`relative flex-1 ${className}`}
      onMouseEnter={handleReactMouseEnter}
      onMouseLeave={handleReactMouseLeave}
    >
      <Button
        variant="ghost"
        size="lg"
        className="w-full justify-center flex-1 rounded "
      >
        <ThumbsUp className=" h-5 w-5" /> Thích
      </Button>
      {/* React popup */}
      {showReacts && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex gap-1 bg-background border rounded-xl shadow-lg p-2 z-10 animate-in fade-in">
          {REACTS.map((r) => (
            <Button
              key={r.type}
              variant="ghost"
              size="icon"
              title={r.label}
            >
              {r.icon}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
} 