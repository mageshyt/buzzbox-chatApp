import { InitialModal } from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/initial.profile";
import serverService from "@/services/server.service";
import { redirect } from "next/navigation";
import React from "react";

const SetupPage = async () => {
  const profile = await initialProfile();
  if (!profile) return <div>Profile not found</div>;

  const servers = await serverService.getServers(profile?.id as string);

  console.log(servers);
  if (servers?.length !== 0) {
    return redirect(`/servers/${servers[0].id}`);
  }

  return <InitialModal/>
};

export default SetupPage;
