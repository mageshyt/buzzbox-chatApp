"use client";
import React, { FC, useEffect, useState } from "react";
import { Member, MemberRole, Profile } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import qs from "query-string";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Edit2, File, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import UserAvatar from "@/components/user-avatar";
import ActionTooltip from "@/components/action-tooltip";

import { MessageInfoDisplay } from "./chat-message-info";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal";
import { useParams, useRouter } from "next/navigation";

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

const formSchema = z.object({
  content: z.string().min(1),
});

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

  const { openModal } = useModal();
  // Router and Prams

  const router = useRouter();
  const params = useParams();

  //   Form state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    // Reset form when content changes
    form.reset({
      content: content,
    });
  }, [content]);

  const onMemberClick = () => {
    if (member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
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

  // UseEffect for handle keypress

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event?.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isLoading = form.formState.isSubmitting;

  const style = {
    wrapper:
      "relative group flex items-center hover:bg-black/5 p-4 transition w-full",
    MainContainer: "group flex gap-x-2 items-start w-full",
    profileName: "font-semibold text-sm hover:underline cursor-pointer",
    avatar: "transition cursor-pointer hover:drop-shadow-md hover:scale-105",
    timeStamp: "text-xs text-zinc-500 dark:text-zinc-400",
    bodyContainer: "flex flex-col w-full",
    image:
      "relative flex items-center w-48   h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary",
    text_msg: "text-sm text-zinc-600 dark:text-zinc-300 ",
    deleted_msg: "line-through italic text-xs mt-1",
    delete_btn:
      "absolute items-center hidden p-2 transition bg-white border rounded-md group-hover:flex gap-x-2 top-2 right-5 dark:bg-zinc-800",

    icon: "w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300",
    input:
      "p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200",
  };

  return (
    <div className={style.wrapper}>
      <div className={style.MainContainer}>
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

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full pt-2 gap-x-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 border-0 border-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className={style.delete_btn}>
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit2
                onClick={() => setIsEditing(true)}
                className={style.icon}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash2
              onClick={() =>
                openModal("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                  name: name,
                })
              }
              className={style.icon}
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
