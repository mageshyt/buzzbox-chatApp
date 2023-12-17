import ChatHeader from "@/components/chat/chat-header";
import { client } from "@/lib/client";
import { currentProfile } from "@/lib/current-profile";
import { conversationService } from "@/services/conversation.service";
import memberService from "@/services/member.service";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC } from "react";
interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}
const MemberIdPage: FC<MemberIdPageProps> = async ({
  params: { memberId, serverId },
}) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const currentMember = await memberService.getMember(profile.id, serverId);
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
    </div>
  );
};

export default MemberIdPage;
