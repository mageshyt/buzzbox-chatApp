import React, { FC } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ServerWithMembersAndProfile } from "@/typings/typing";
import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  Delete,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  console.log("role", role);

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
          <DropdownMenuItem className={style.menuItem}>
            Server Settings
            <Settings className={style.icon} />
          </DropdownMenuItem>
        )}

        {/* manage member */}

        {isAdmin && (
          <DropdownMenuItem className={style.menuItem}>
            Manage Member
            <Users className={style.icon} />
          </DropdownMenuItem>
        )}

        {/* create channel */}
        {isAdmin && (
          <DropdownMenuItem className={style.menuItem}>
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
