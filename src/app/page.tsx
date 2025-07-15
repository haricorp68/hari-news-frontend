import { PostFeedList } from "@/components/post/PostFeedList";

const tempPosts = [
  {
    id: "13726ee5-5f5f-4474-a373-e16465cb5bb1",
    caption: "Đây là bài viết demo số 1!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: "user1",
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
    reactionSummary: {
      like: 12,
      love: 3,
      haha: 1,
      sad: 0,
      angry: 0,
      meh: 0,
      dislike: 0,
    },
    commentCount: 5,
  },
  {
    id: "2",
    caption: "Bài viết số 2 với video demo!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: "user2",
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
    reactionSummary: {
      like: 2,
      love: 0,
      haha: 0,
      sad: 0,
      angry: 0,
      meh: 0,
      dislike: 0,
    },
    commentCount: 1,
  },
  {
    id: "3",
    caption: "Bài viết số 3 chỉ có text.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: "user3",
      name: "Lê Văn C",
      avatar: "https://picsum.photos/seed/c/60/60",
    },
    media: [],
    reactionSummary: {
      like: 0,
      love: 0,
      haha: 0,
      sad: 0,
      angry: 0,
      meh: 0,
      dislike: 0,
    },
    commentCount: 0,
  },
];

export default function Home() {
  return (
    <div className="max-w-xl mx-auto py-8">
      <PostFeedList posts={tempPosts} />
    </div>
  );
}
