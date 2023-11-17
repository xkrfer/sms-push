import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function UserAvatar(props: UserAvatarProps) {
  const { src, alt, fallback } = props;
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
