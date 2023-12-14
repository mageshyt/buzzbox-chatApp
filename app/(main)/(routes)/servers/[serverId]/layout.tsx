import { redirect } from "next/navigation";
import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import ServerSidebar from "@/components/server/server-sidebar";

import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server.service";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await serverService.getServer(params.serverId, profile.id);

  if (!server) {
    // toast.error("Access Denied");
    return redirect("/");
  }

  console.log(server);

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 flex-col hidden h-full md:flex w-60">
        {/* server sidebar */}
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
