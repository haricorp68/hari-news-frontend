// import { PostFeedList } from "@/components/post/PostFeedList";
import { NewsSummaryCardList } from "@/components/post/NewsSummaryCardList";
import newsSummaryData from "@/lib/modules/post/news.summary.temp.json";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto py-8 grid gap-6">
      <NewsSummaryCardList posts={newsSummaryData} loading={false} />
    </div>
  );
}
