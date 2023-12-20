import { client } from "@/lib/client";
import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server-service";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}
const InviteCodePage: FC<InviteCodePageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    // if no invite code, redirect to home
    return redirect("/");
  }
  //   check if the user is already in the server
  const existingServer = await client.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });


  if (existingServer) {
    // redirect to the server

    return redirect(`/servers/${existingServer.id}`);
  }

  //   join the server

  const server = await serverService.joinServer(params.inviteCode, profile.id);

  // console.log("👉 JOIN SERVER", server);

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
