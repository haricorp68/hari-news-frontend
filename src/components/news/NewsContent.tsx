import { NewsBlockRenderer } from "./NewsBlockRenderer";

interface Block {
  id: string;
  type: string;
  content: string;
  media_url: string | null;
  file_size: number | null;
  file_name: string | null;
  order: number;
}

interface NewsContentProps {
  blocks?: Block[];
  slugify: (str: string) => string;
}

export function NewsContent({ blocks, slugify }: NewsContentProps) {
  if (!Array.isArray(blocks)) return null;

  return (
    <div className="prose prose-neutral max-w-none mb-8">
      {blocks.map((block) => (
        <NewsBlockRenderer key={block.id} block={block} slugify={slugify} />
      ))}
    </div>
  );
}
