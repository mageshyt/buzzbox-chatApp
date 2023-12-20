"use client";

import { Member, Message, Profile } from "@prisma/client";
import React, { ElementRef, FC, Fragment, useRef } from "react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";

import { MessageWithMemberProfile } from "@/typings/typing";

import { ChatItem } from "./chat-item";
import { ChatWelcome } from "./chat-welcome";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

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
    wrapper:
      "flex-1 flex flex-col py-4 overflow-y-scroll  scrollbar-thin scrollbar-thumb-zinc-800 ",
    welcomeContainer: "flex-1",
  };
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  // Ref - for scroll to bottom

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
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
    <div ref={chatRef} className={style.wrapper}>
      {!hasNextPage && <div className={style.welcomeContainer} />}

      {!hasNextPage && <ChatWelcome name={name} type={type} />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-sm transition text-zinc-600 dark:text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
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

      <div ref={bottomRef} />
    </div>
  );
};
