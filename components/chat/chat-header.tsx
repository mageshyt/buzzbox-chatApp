import { Hash } from "lucide-react";
import React, { FC } from "react";
import MobileToggle from "@/components/mobile-toggle";
import Image from "next/image";
import UserAvatar from "../user-avatar";

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

  console.log(type);
  return (
    <div className={style.wrapper}>
      <MobileToggle serverId={serverId} />
      {type == "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}

      {type == "conversation" && imageUrl && (
        <Image
          width={32}
          height={32}
          src={imageUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      <p className={style.label}>{name}</p>
    </div>
  );
};

export default ChatHeader;
