import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { client } from "@/lib/client";
import { currentProfile } from "@/lib/current-profile";
import { conversationService } from "@/services/conversation-service";
import memberService from "@/services/member-service";
import { redirectToSignIn } from "@clerk/nextjs";
import { Member } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { FC } from "react";
interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
  };
}
const MemberIdPage: FC<MemberIdPageProps> = async ({
  params: { memberId, serverId },
  searchParams: { video },
}) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const currentMember: Member | null = await memberService.getMember(
    profile.id,
    serverId
  );
  if (!currentMember) return redirect("/");

  const conversation = await conversationService.getOrCreateConversation(
    currentMember.id,
    memberId
  );

  // if no conversation, then redirect to general page

  if (!conversation) {
    return redirect(`/servers/${serverId}/`);
  }

  const { memberOne, memberTwo } = conversation;

  // if currentMember is memberOne, then otherMember is memberTwo
  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

  const style = {
    wrapper: "bg-white dark:bg-[#313338] flex flex-col h-full",
  };
  return (
    <div className={style.wrapper}>
      <ChatHeader
        type="conversation"
        serverId={serverId}
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
      />
      {
        // if video is true, then show video
        video && <MediaRoom chatId={conversation.id} mediaType="video" />
      }
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
