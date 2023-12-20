import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import MobileToggle from "@/components/mobile-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import channelService from "@/services/channel-service";
import { redirectToSignIn } from "@clerk/nextjs";
import { Channel, Member } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { FC } from "react";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelPage: FC<ChannelPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const [channel, member] = await channelService.getChannelDetails(
    params.channelId,
    params.serverId,
    profile.id
  );

  if (!channel || !member) return redirect("/");
  const style = {
    wrapper: "bg-white dark:bg-[#313338] flex flex-col h-full",
  };

  return (
    <div className={style.wrapper}>
      <ChatHeader
        type="channel"
        name={(channel as Channel).name}
        serverId={params.serverId}
      />

      {(channel as Channel).type === "TEXT" && (
        <>
          <ChatMessages
            member={member as Member}
            name={(channel as Channel).name}
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              serverId: params.serverId,
              channelId: channel.id,
            }}
            paramKey="channelId"
            paramValue={channel.id}
            type="channel"
          />

          <ChatInput
            type="channel"
            name={(channel as Channel).name}
            apiUrl="/api/socket/messages"
            query={{
              serverId: params.serverId,
              channelId: params.channelId,
            }}
          />
        </>
      )}

      {(channel as Channel).type === "AUDIO" && (
        <MediaRoom chatId={channel.id} mediaType="audio" />
      )}

      {(channel as Channel).type === "VIDEO" && (
        <MediaRoom chatId={channel.id} mediaType="video" />
      )}
    </div>
  );
};

export default ChannelPage;
