"use client";
import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { FC } from "react";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

export const roleIconsMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-auto text-red-400" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 ml-auto text-indigo-400" />
  ),
  [MemberRole.GUEST]: null,
};
const ServerMember: FC<ServerMemberProps> = ({ member, server }) => {
  const style = {
    wrapper:
      "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 transition mb-1 dark:hover:bg-zinc-700/50",
    avatar: "w-8 h-8 md:w-8 md:h-8 rounded-full",
    label: "line-clamp-1 font-semibold text-sm transition text-zinc-500",
  };
  const params = useParams();
  const router = useRouter();

  const icon = roleIconsMap[member.role];

  const handleClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        style.wrapper,
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        alt="avatar"
        imageUrl={member.profile.imageUrl}
        className={style.avatar}
      />
      <p
        className={cn(
          style.label,
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
