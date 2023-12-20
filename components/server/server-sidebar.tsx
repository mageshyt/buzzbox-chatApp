import React, { FC } from "react";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server-service";
import { ChannelType, MemberRole } from "@prisma/client";

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import ServerSection from "./server-section";
import ServerSearch from "./server-search";
import ServerHeader from "./server-Header";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconsMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-red-400" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-400" />
  ),
  [MemberRole.GUEST]: null,
};
const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await serverService.getServerDetail(serverId, profile.id);

  // ! if no server the redirect to home page
  if (!server) {
    return redirect("/");
  }

  const textChannel = server?.channels?.filter(
    (channel) => channel.type === "TEXT"
  );

  const voiceChannel = server?.channels?.filter(
    (channel) => channel.type === "AUDIO"
  );

  const videoChannel = server?.channels?.filter(
    (channel) => channel.type === "VIDEO"
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannel?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: voiceChannel?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannel?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  icon: roleIconsMap[member.role],
                  name: member.profile.name,
                  id: member.id,
                })),
              },
            ]}
          />
        </div>
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mt-2" />

        {!!textChannel?.length && (
          <div className="mb-2">
            <ServerSection
              channelType={ChannelType.TEXT}
              label="Text channels"
              sectionType="channel"
              role={role}
              server={server}
            />
            {textChannel.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}

        {!!voiceChannel?.length && (
          <div className="mb-2">
            <ServerSection
              channelType={ChannelType.AUDIO}
              label="Voice channels"
              sectionType="channel"
              role={role}
              server={server}
            />
            {voiceChannel.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}

        {!!voiceChannel?.length && (
          <div className="mb-2">
            <ServerSection
              channelType={ChannelType.VIDEO}
              label="Video channels"
              sectionType="channel"
              role={role}
              server={server}
            />
            {videoChannel.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              label="Members"
              sectionType="member"
              role={role}
              server={server}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
