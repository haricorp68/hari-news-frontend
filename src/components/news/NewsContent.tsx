import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { UserProfileLink } from "../ui/user-profile-link";
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

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface NewsContentProps {
  blocks?: Block[];
  slugify: (str: string) => string;
  user: User;
}

export function NewsContent({ blocks, slugify, user }: NewsContentProps) {
  if (!Array.isArray(blocks)) return null;

  return (
    <div className="prose prose-neutral max-w-none mb-8">
      {blocks.map((block) => (
        <NewsBlockRenderer key={block.id} block={block} slugify={slugify} />
      ))}
      {user && (
        <div className="flex flex-col items-end ">
          <p className="text-base font-xs italic">Tác giả</p>
          <div className="flex items-center gap-2">
            <UserProfileLink user={user} avatarOnly>
              <Avatar className="w-9 h-9">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </UserProfileLink>
            <UserProfileLink
              user={user}
              className="text-base font-medium text-gray-800 hover:underline"
            >
              {user.name}
            </UserProfileLink>
          </div>
        </div>
      )}
    </div>
  );
}
