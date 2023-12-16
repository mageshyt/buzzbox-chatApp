"use client";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Edit, Hash, Lock, LockIcon, Mic, Trash, Video } from "lucide-react";
import ActionTooltip from "../action-tooltip";

interface ServerChannelProps {
  channel: Channel;
  server?: Server;
  role?: MemberRole;
}

const IconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};
const ServerChannel: FC<ServerChannelProps> = ({ channel, server, role }) => {
  const router = useRouter();
  const params = useParams();

  const style = {
    button:
      "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 transition mb-1 dark:hover:bg-zinc-700/50",
    icon: "flex-shrink-0 w-5 h-5 text-zinc-400 dark:text-zinc-400",
    label:
      "line-clamp-1 font-semibold text-sm transition text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
  };

  const Icon = IconMap[channel.type];
  return (
    <button
      onClick={() => router.push(`/channels/${params.serverId}/${channel.id}`)}
      className={cn(
        style.button,
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className={style.icon} />
      <p
        className={cn(
          style.label,
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {/* if general channel then lock it */}

      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit className="hidden group-hover:block w-5 h-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 transition" />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash className="hidden group-hover:block w-5 h-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 transition" />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <LockIcon className="w-4 ml-auto h-4 text-zinc-50 dark:text-zinc-400" />
      )}


    </button>
  );
};

export default ServerChannel;
