"use client";
import React, { FC } from "react";

import { cn } from "@/lib/utils";
import { ServerWithMembersAndProfile } from "@/typings/typing";
import { MemberRole } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ServerHeaderProps {
  server: ServerWithMembersAndProfile;
  role?: MemberRole;
}
const ServerHeader: FC<ServerHeaderProps> = ({ server, role }) => {
  const style = {
    icon: "w-4 h-4 ml-auto",
    menuContent: "w-56 space-y-1 text-base font-medium dark:text-neutral-400",
    menuItem: "px-3 py-2 text-sm  cursor-pointer ",
  };

  const { openModal } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const router = useRouter();

  const handleLeaveServer = async () => {
    try {
      const res = await axios.patch(`/api/servers/${server.id}/leave`);

      router.push("/");
      router.refresh();

      console.log(res);
    } catch (error) {
      console.log("👉 Error", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none " asChild>
        <button className="flex items-center w-full h-12 px-3 font-semibold transition border-b-2 text-md border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDown className="w-5 h-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={style.menuContent}>
        {/* invite people */}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => openModal("invite", { server })}
            className={cn(
              style.menuItem,
              "text-indigo-600 dark:text-indigo-400"
            )}
          >
            Invite People
            <UserPlus className={style.icon} />
          </DropdownMenuItem>
        )}

        {/* server settings */}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => openModal("editServer", { server })}
            className={style.menuItem}
          >
            Server Settings
            <Settings className={style.icon} />
          </DropdownMenuItem>
        )}

        {/* manage member */}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => openModal("manageMember", { server })}
            className={style.menuItem}
          >
            Manage Member
            <Users className={style.icon} />
          </DropdownMenuItem>
        )}

        {/* create channel */}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => openModal("createChannel", { server })}
            className={style.menuItem}
          >
            Create Channel
            <PlusCircle className={style.icon} />
          </DropdownMenuItem>
        )}

        {isModerator && <DropdownMenuSeparator />}

        {/* delete server */}
        {isAdmin && (
          <DropdownMenuItem
            className={cn(style.menuItem, "text-rose-600 dark:text-red-400")}
          >
            Delete Server
            <Trash className={style.icon} />
          </DropdownMenuItem>
        )}

        {/* leave server [guest , mod] can leave */}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={handleLeaveServer}
            className={cn(style.menuItem, "text-rose-600 dark:text-red-400")}
          >
            Leave Server
            <LogOut className={style.icon} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
