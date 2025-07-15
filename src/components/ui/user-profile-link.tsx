import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileLinkProps {
  user: { id: string; name: string; avatar?: string | null };
  children?: React.ReactNode;
  className?: string;
  avatarOnly?: boolean;
}

export function UserProfileLink({ user, children, className = "", avatarOnly = false }: UserProfileLinkProps) {
  return (
    <Link href={`/profile/${user.id}`} prefetch={false} className={className}>
      {avatarOnly ? (
        <Avatar className="size-8 mt-1">
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      ) : (
        children ?? user.name
      )}
    </Link>
  );
} 