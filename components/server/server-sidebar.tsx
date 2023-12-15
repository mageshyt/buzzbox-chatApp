import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server.service";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import ServerHeader from "./server-Header";

interface ServerSidebarProps {
  serverId: string;
}
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

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  console.log("👉 members", members);

  return (
    <div className="h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader
      server={server}  
      role={role}
      />
    </div>
  );
};

export default ServerSidebar;
