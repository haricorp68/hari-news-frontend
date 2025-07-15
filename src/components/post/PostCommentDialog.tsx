import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCommentList } from "@/lib/modules/comment/hooks/useCommentList";
import { useCreateComment } from "@/lib/modules/comment/hooks/useCreateComment";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CommentList } from "@/components/ui/comment-list";

interface UserFeedPostMedia {
  url: string;
  type: string;
  order: number;
}

interface PostCommentDialogProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: UserFeedPostMedia[];
}

export function PostCommentDialog({
  postId,
  open,
  onOpenChange,
  media,
}: PostCommentDialogProps) {
  const { comments, commentsLoading } = useCommentList(postId, open);
  const { createComment, createCommentLoading } = useCreateComment();
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment({ postId, postType: "post", content });
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1100px] !w-[1100px] !h-[90vh] !min-h-[500px] p-0 overflow-hidden border-0">
        <div className="flex flex-row w-full h-full">
          {/* Left: Media (5.5/10) */}
          <div className="flex-[5.5] bg-black flex items-center justify-center min-w-0 relative">
            {media && media.length > 0 ? (
              <Carousel className="w-full h-full flex items-center justify-center">
                <CarouselContent className="h-full">
                  {media.map((m, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex items-center justify-center h-full"
                    >
                      {m.type.startsWith("image") ? (
                        <Image
                          src={m.url}
                          alt="media"
                          width={800}
                          height={600}
                          className="object-contain max-h-[75vh] max-w-full rounded-lg bg-black"
                        />
                      ) : (
                        <video
                          src={m.url}
                          controls
                          className="object-contain max-h-[75vh] max-w-full rounded-lg bg-black"
                        />
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 z-10" />
                <CarouselNext className="right-2 z-10" />
              </Carousel>
            ) : (
              <span className="text-muted-foreground">Không có media</span>
            )}
          </div>
          {/* Right: Bình luận (4.5/10) */}
          <div className="flex-[4.5] flex flex-col h-full min-w-0">
            <Card className="rounded-none border-0 shadow-none h-full flex flex-col">
              <CardHeader className="flex-row items-center gap-3 border-b pb-2 mb-0">
                <Avatar className="size-8">
                  <AvatarImage
                    src={comments?.[0]?.user.avatar || undefined}
                    alt={comments?.[0]?.user.name || "U"}
                  />
                  <AvatarFallback>
                    {comments?.[0]?.user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <DialogTitle></DialogTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto px-4 py-2">
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
              </CardContent>
              <form
                onSubmit={handleSubmit}
                className="border-t p-4 flex gap-2 items-end"
              >
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="flex-1 resize-none min-h-10"
                  rows={1}
                  disabled={createCommentLoading}
                />
                <Button
                  type="submit"
                  disabled={createCommentLoading || !content.trim()}
                >
                  Đăng
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
