import React, { FC } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  imageUrl: string;
  alt: string;
  className?: string;
}
const UserAvatar: FC<UserAvatarProps> = ({ imageUrl, alt ,className}) => {
  return (
    <Avatar className={cn("h-7 w-7 md:w-10 md:h-10",className)}>
      <AvatarImage src={imageUrl} alt={alt} />
    </Avatar>
  );
};

export default UserAvatar;
