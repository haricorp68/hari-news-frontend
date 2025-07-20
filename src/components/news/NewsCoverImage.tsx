import Image from "next/image";

interface NewsCoverImageProps {
  coverImage?: string;
  title?: string;
}

export function NewsCoverImage({ coverImage, title }: NewsCoverImageProps) {
  if (!coverImage) return null;

  return (
    <div className="relative w-full aspect-[16/9] max-w-5xl mx-auto">
      <Image
        src={coverImage}
        alt={title ?? "cover"}
        fill
        className="object-cover w-full h-full"
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
      />
    </div>
  );
} 