"use client";
import { ServerWithMembersAndProfile } from "@/typings/typing";
import { ChannelType, MemberRole } from "@prisma/client";
import React, { FC } from "react";
import { Plus, Settings } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hooks/use-modal";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  server?: ServerWithMembersAndProfile;
}

const ServerSection: FC<ServerSectionProps> = ({
  label,
  role,
  sectionType,
  server,
  channelType,
}) => {
  const style = {
    wrapper: "flex items-center justify-normal py-2",
    label: "text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400",
    button: "ml-auto  text-zinc-500 dark:text-zinc-400  ",
  };

  const { openModal } = useModal();
  return (
    <div className={style.wrapper}>
      <p className={style.label}>{label}</p>
      {role !== MemberRole.GUEST &&
        (sectionType === "channel" ? (
          <ActionTooltip label="create channel" side="top">
            <button
              onClick={() => openModal("createChannel", { server })}
              className={style.button}
            >
              <Plus className="w-4 h-4" />
            </button>
          </ActionTooltip>
        ) : null)}

      {role === MemberRole.ADMIN && sectionType === "member" && (
        <ActionTooltip label="Manage Member" side="top">
          <button
            onClick={() => openModal("manageMember", { server })}
            className={style.button}
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
