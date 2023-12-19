import { MessageWithMemberProfile } from "@/typings/typing";
import React, { FC, useState } from "react";

import UserAvatar from "@/components/user-avatar";

import { format } from "date-fns";
import { MessageInfoDisplay } from "./chat-message-info";
import { Member, MemberRole, Profile } from "@prisma/client";
import Image from "next/image";
import { Edit2, File, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionTooltip from "../action-tooltip";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };

  fileUrl: string | null;
  deleted: boolean;
  createdAt: Date;
  currentMember: Member;
  isUpdate?: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export const ChatItem: FC<ChatItemProps> = ({
  content,
  fileUrl,
  id,
  member,
  deleted,
  createdAt,
  currentMember,
  isUpdate,
  socketQuery,
  socketUrl,
}) => {
  const timestamp = format(new Date(createdAt), DATE_FORMAT);

  const onMemberClick = () => {
    console.log("TODO: implement member click");
  };

  const fileType = fileUrl?.split(".").pop();

  // Extract role information for easier readability
  const { role, id: memberId, profile } = member;
  const { imageUrl, name } = profile;

  // Determine member permissions
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === memberId;

  // Only admins, moderators, and the owner can delete messages
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);

  // If the message is not deleted, only the owner can edit it, and it's not a file
  const canEditMessage = !deleted && isOwner && !fileUrl;

  // Determine file type
  const isPdf = fileType === "pdf";
  const isImage = !isPdf && fileUrl;

  // Editing and delete state
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const style = {
    wrapper:
      "relative group flex items-center hover:bg-black/5 p-4 transition w-full",
    chatHeader: "flex group  w-full items-start p-2 gap-x-2",
    profileName: "font-semibold text-sm hover:underline cursor-pointer",
    avatar: "transition cursor-pointer hover:drop-shadow-md hover:scale-105",
    timeStamp: "text-xs text-zinc-500 dark:text-zinc-400",
    bodyContainer: "flex flex-col",
    image:
      "relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary",
    text_msg: "text-sm text-zinc-600 dark:text-zinc-400",
    deleted_msg: "line-through italic text-xs mt-1",
    delete_btn:
      "absolute items-center hidden p-2 transition bg-white border rounded-md group-hover:flex gap-x-2 top-2 right-5 dark:bg-zinc-800",

    icon: "w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300",
  };

  return (
    <div className={style.wrapper}>
      <div className={style.chatHeader}>
        {/* Avatar */}
        <div onClick={onMemberClick} className={style.avatar}>
          <UserAvatar imageUrl={imageUrl} alt="avatar" />
        </div>

        <div className={style.bodyContainer}>
          {/* Message Info Display */}
          <MessageInfoDisplay
            onMemberClick={onMemberClick}
            name={name}
            role={role}
            timestamp={timestamp}
          />

          {/* Message Content */}
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={style.image}
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}

          {isPdf && (
            <div className="relative flex items-center p-2 rounded-md bg-background/10">
              <File className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />

              <a
                href={fileUrl || "#"}
                target="_blank"
                className="ml-2 font-medium text-indigo-500 hover:text-indigo-600 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p className={cn(style.text_msg, deleted && style.deleted_msg)}>
              {content}
              {isUpdate && !deleted && (
                <span className="ml-1 text-xs text-zinc-600 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className={style.delete_btn}>
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit2 className={style.icon} />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash2 className={style.icon} />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
