import Image from "next/image";

interface Block {
  id: string;
  type: string;
  content: string;
  media_url: string | null;
  file_size: number | null;
  file_name: string | null;
  order: number;
}

interface NewsBlockRendererProps {
  block: Block;
  slugify: (str: string) => string;
}

export function NewsBlockRenderer({ block, slugify }: NewsBlockRendererProps) {
  if (block?.type === "heading_1")
    return (
      <h2
        key={block.id}
        id={slugify(block.content)}
        className="text-2xl font-bold mt-8 mb-2 scroll-mt-24"
      >
        {block.content}
      </h2>
    );
  
  if (block?.type === "heading_2")
    return (
      <h3
        key={block.id}
        id={slugify(block.content)}
        className="text-xl font-semibold mt-6 mb-2 scroll-mt-24"
      >
        {block.content}
      </h3>
    );
  
  if (block?.type === "heading_3")
    return (
      <h4
        key={block.id}
        id={slugify(block.content)}
        className="text-lg font-semibold mt-4 mb-2 scroll-mt-24"
      >
        {block.content}
      </h4>
    );
  
  if (block?.type === "text")
    return (
      <p key={block.id} className="mb-4 text-base">
        {block.content}
      </p>
    );
  
  if (block?.type === "image" && block.media_url)
    return (
      <div
        key={block.id}
        className="my-6 flex flex-col items-center w-full"
      >
        <Image
          src={block.media_url}
          alt={block.content || "image"}
          width={900}
          height={500}
          className="rounded-xl object-contain max-h-[500px] w-full max-w-3xl"
        />
        {block.content && (
          <div className="text-sm text-gray-500 mt-2 italic">
            {block.content}
          </div>
        )}
      </div>
    );
  
  if (block?.type === "file" && block.media_url) {
    const sizeMB = block.file_size
      ? `(${(block.file_size / 1024 / 1024).toFixed(1)} MB)`
      : "";
    return (
      <div
        key={block.id}
        className="my-6 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 w-full max-w-3xl mx-auto"
      >
        <svg
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <div className="flex-1">
          <div className="font-medium text-blue-700">
            {block.file_name || "Tài liệu đính kèm"}{" "}
            {sizeMB}
          </div>
          {block.content && (
            <div className="text-xs text-gray-500 mt-1">
              {block.content}
            </div>
          )}
        </div>
        <a
          href={block.media_url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
        >
          Tải về
        </a>
      </div>
    );
  }
  
  if (block?.type === "video" && block.media_url)
    return (
      <div
        key={block.id}
        className="my-6 flex flex-col items-center w-full"
      >
        <video
          src={block.media_url}
          controls
          className="rounded-xl max-w-3xl w-full max-h-[500px] bg-black"
        />
        {block.content && (
          <div className="text-sm text-gray-500 mt-2">
            {block.content}
          </div>
        )}
      </div>
    );
  
  return null;
} 