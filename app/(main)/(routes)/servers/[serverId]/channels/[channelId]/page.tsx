import ChatHeader from "@/components/chat/chat-header";
import MobileToggle from "@/components/mobile-toggle";
import { currentProfile } from "@/lib/current-profile";
import channelService from "@/services/channel.service";
import { redirectToSignIn } from "@clerk/nextjs";
import { Channel } from "@prisma/client";
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
    </div>
  );
};

export default ChannelPage;
