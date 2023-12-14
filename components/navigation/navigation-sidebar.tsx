import { redirect } from "next/navigation";
import React from "react";

import { UserButton } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";

import serverService from "@/services/server.service";
import { currentProfile } from "@/lib/current-profile";

import NavigationAction from "./navigation-action";
import NavigationItem from "./navigation-item";

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  const servers = await serverService.getServers(profile?.id as string);

  if (!profile) return redirect("/");
  return (
    <div className="flex flex-col items-center h-full py-3 space-y-4 bg-[#1E1F22] text-primary px-2">
      <NavigationAction />

      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

      <ScrollArea className="flex-1 w-full">
        {servers.map((server, idx) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>

      <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
        {/* Theme switch  */}
        <ModeToggle />
        {/* user bnt */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
