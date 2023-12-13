import { redirect } from "next/navigation";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { initialProfile } from "@/lib/initial.profile";
import serverService from "@/services/server.service";
import NavigationAction from "./navigation-action";
import Image from "next/image";

const NavigationSidebar = async () => {
  const profile = await initialProfile();

  const servers = await serverService.getServers(profile?.id as string);

  if (!profile) return redirect("/");
  return (
    <div className="flex flex-col items-center h-full py-3 space-y-4 bg-[#1E1F22] text-primary px-2">
      <NavigationAction />

      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

      <ScrollArea className="flex-1 w-full mb-4">
        {servers.map((server, idx) => (
          <div key={idx}>
            <Image
              src={server.imageUrl as string}
              alt={server.name as string}
              width={40}
              height={40}
              className="rounded-md "
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default NavigationSidebar;
