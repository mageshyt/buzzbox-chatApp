import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server.service";
import { redirect } from "next/navigation";
import React, { FC } from "react";

interface ServerSidebarProps {
  serverId: string;
}
const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await serverService.getServerDetail(serverId, profile.id);

  console.log("👉 server", server);

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

  console.log("👉 members", members);

  return <div></div>;
};

export default ServerSidebar;
