import { PostFeedItem } from "@/components/common/PostFeedItem";

const tempPosts = [
  {
    id: 1,
    caption: "Đây là bài viết demo số 1!",
    created_at: new Date().toISOString(),
    user: {
      name: "Nguyễn Văn A",
      avatar: "https://picsum.photos/seed/a/60/60",
    },
    media: [
      {
        url: "https://picsum.photos/seed/1/600/400",
        type: "image/jpeg",
        order: 1,
      },
      {
        url: "https://picsum.photos/seed/2/600/400",
        type: "image/jpeg",
        order: 2,
      },
      {
        url: "https://picsum.photos/seed/2/600/400",
        type: "image/jpeg",
        order: 3,
      },
      {
        url: "https://picsum.photos/seed/2/600/400",
        type: "image/jpeg",
        order: 4,
      },
      {
        url: "https://picsum.photos/seed/2/600/400",
        type: "image/jpeg",
        order: 5,
      },
      {
        url: "https://picsum.photos/seed/2/600/400",
        type: "image/jpeg",
        order: 6,
      },
    ],
    reacts: { like: 12, love: 3, haha: 1, wow: 0, sad: 0, angry: 0 },
    commentCount: 5,
    shareCount: 2,
  },
  {
    id: 2,
    caption: "Bài viết số 2 với video demo!",
    created_at: new Date().toISOString(),
    user: {
      name: "Trần Thị B",
      avatar: "https://picsum.photos/seed/b/60/60",
    },
    media: [
      {
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "video/mp4",
        order: 1,
      },
    ],
    reacts: { like: 2, love: 0, haha: 0, wow: 1, sad: 0, angry: 0 },
    commentCount: 1,
    shareCount: 0,
  },
  {
    id: 3,
    caption: "Bài viết số 3 chỉ có text.",
    created_at: new Date().toISOString(),
    user: {
      name: "Lê Văn C",
      avatar: "https://picsum.photos/seed/c/60/60",
    },
    media: [],
    reacts: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
    commentCount: 0,
    shareCount: 0,
  },
];

export default function Home() {
  return (
    <div className="max-w-xl mx-auto py-8">
      {tempPosts.map((post) => (
        <PostFeedItem key={post.id} post={post} />
      ))}
    </div>
  );
}
