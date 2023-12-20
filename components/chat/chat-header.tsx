import { Hash } from "lucide-react";
import React, { FC } from "react";
import MobileToggle from "@/components/mobile-toggle";
import Image from "next/image";
import { SocketIndicatorBadge } from "../socket-indicator-badge";
import { ChatVideoButton } from "../video-chat-button";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({
  serverId,
  name,
  type,
  imageUrl,
}) => {
  const style = {
    wrapper:
      "text-base font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2",
    label: "from-secondary text-base to-black dark:text-white",
  };

  return (
    <div className={style.wrapper}>
      <MobileToggle serverId={serverId} />
      {type == "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}

      {type == "conversation" && imageUrl && (
        <Image
          width={32}
          height={32}
          src={imageUrl}
          alt="avatar"
          className="w-8 h-8 mr-2 rounded-full"
        />
      )}

      <p className={style.label}>{name}</p>

      {/* socket connection */}

      <div className="flex items-center gap-x-2 ml-auto">
        {type == "conversation" && <ChatVideoButton />}
        <SocketIndicatorBadge />
      </div>
    </div>
  );
};

export default ChatHeader;
