"use client";

import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

import React, { FC } from "react";
import Image from "next/image";

const NavigationItem: FC<NavigationItemProps> = ({ id, imageUrl, name }) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/servers/${id}`);
  };
  return (
    <ActionTooltip label={name} align="center" side="right">
      <button
        onClick={handleClick}
        className={cn("flex items-center group relative")}
      >
        {/* indicator */}
        <div
          className={cn(
            "my-4 absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]",
            params?.serverId != id && "group-hover:h-[20px]"
          )}
        />

        <div
          className={cn(
            `relative group flex mx-3 h-[48px] w-[48px] 
            rounded-[25px] overflow-hidden group-hover:rounded-[16px]`,
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image src={imageUrl} alt={name} fill />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
