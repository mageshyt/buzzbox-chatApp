"use client";

import { Member, Message, Profile } from "@prisma/client";
import React, { FC, Fragment } from "react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";

import { MessageWithMemberProfile } from "@/typings/typing";

import { ChatItem } from "./chat-item";
import { ChatWelcome } from "./chat-welcome";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}
export const ChatMessages: FC<ChatMessagesProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}) => {
  const style = {
    wrapper: "flex-1 flex flex-col py-4 overflow-y-scroll",
    welcomeContainer: "flex-1",
  };

  const queryKey = `chat:${chatId}`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        <span className="mt-2 text-gray-500">Loading Messages...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <ServerCrash className="w-8 h-8 text-rose-500 stroke-rose-400 " />
        <span className="mt-2 text-gray-500">
          Failed to load messages, please try again later.
        </span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={style.wrapper}>
      <div className={style.welcomeContainer} />
      <ChatWelcome name={name} type={type} />

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page?.items.map((message: MessageWithMemberProfile) => (
              <ChatItem
                {...message}
                currentMember={member}
                isUpdate={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
                key={message.id}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
