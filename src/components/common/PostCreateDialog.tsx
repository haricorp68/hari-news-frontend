import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCreateUserFeedPost } from "@/lib/modules/post/hooks/useCreateUserFeedPost";

type PostCreateDialogProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export function PostCreateDialog({ open: controlledOpen, setOpen: controlledSetOpen }: PostCreateDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = controlledSetOpen !== undefined ? controlledSetOpen : setUncontrolledOpen;
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const { mutate: createUserFeedPost, isPending: createLoading } = useCreateUserFeedPost();

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: upload media to get url, here just demo with empty media
    createUserFeedPost({ caption, media: [] });
    setCaption("");
    setMedia([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đăng bài viết mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Bạn đang nghĩ gì?"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            required
            className="resize-none"
          />
          <Input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
          />
          {/* Hiển thị tên file đã chọn */}
          {media.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {media.map((file, idx) => (
                <span key={idx}>{file.name}</span>
              ))}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={createLoading}>
            {createLoading ? "Đang đăng..." : "Đăng bài"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 