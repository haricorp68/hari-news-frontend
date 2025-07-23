import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfileLink } from "@/components/ui/user-profile-link";
import { formatFullTime } from "@/utils/formatTime";

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface NewsHeaderProps {
  title?: string;
  user?: User | null;
  createdAt?: string;
  summary?: string;
}

export function NewsHeader({
  title,
  user,
  createdAt,
  summary,
}: NewsHeaderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight mt-8">
        {title ?? ""}
      </h1>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {user && (
            <>
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
            </>
          )}
        </div>
        <div className="flex flex-col items-end text-xs text-gray-500 min-w-fit">
          <span>{createdAt ? formatFullTime(createdAt) : ""}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="text-lg text-gray-700 mb-6">{summary ?? ""}</div>
    </div>
  );
}
