"use client";
import { useState } from "react";
import qs from "query-string";

import { ServerWithMembersAndProfile } from "@/typings/typing";
import { MemberRole } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UserAvatar from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  CheckCircle,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { useModal } from "@/hooks/use-modal";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-400" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-400" />,
};

export const ManageMemberModal = () => {
  const router = useRouter();
  const style = {
    content: "overflow-hidden text-black bg-white ",
    title: "text-2xl font-bold text-center",
    label:
      "uppercase text-sm font-semibold text-zinc-500 dark:text-secondary/70",
    input:
      "bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black",
    icon: "w-4 h-4 ",
    scrollArea: "pr-6 mt-8 max-h-[420px] space-y-2",
  };

  const { isOpen, onClose, type, data, openModal } = useModal();

  const { server } = data as { server: ServerWithMembersAndProfile };

  const isModelOpen = isOpen && type === "manageMember";

  const [loadingId, setLoadingId] = useState<string>("");

  const handleKick = async (id: string) => {
    try {
      // ! api call to change role

      setLoadingId(id);

      const url = qs.stringifyUrl({
        url: `/api/members/kick/${id}`,
        query: {
          serverId: server.id,
          memberId: id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();

      openModal("manageMember", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const handleRoleChange = async (id: string, role: MemberRole) => {
    try {
      // ! api call to change role

      setLoadingId(id);

      const url = qs.stringifyUrl({
        url: `/api/members/${id}`,
        query: {
          serverId: server.id,
          memberId: id,
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();

      openModal("manageMember", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={style.content}>
        {/* Header */}
        <DialogHeader className="px-6 pt-8">
          {/* Title */}
          <DialogTitle className={style.title}>Manage Members</DialogTitle>
          {/* Description */}
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length} members in {server?.name}
          </DialogDescription>
        </DialogHeader>
        {/* Body */}
        <ScrollArea className={style.scrollArea}>
          {
            // ! list of members

            server?.members.map((member) => (
              <div
                key={member.id}
                className="flex  items-center m-2 mb-4 gap-x-2"
              >
                <UserAvatar
                  imageUrl={member?.profile.imageUrl}
                  alt={member?.profile.name}
                />

                <div className="flex flex-col gap-y-1">
                  <div className="flex items-center text-xs font-semibold">
                    {member?.profile.name}

                    {roleIconMap[member?.role]}
                  </div>

                  {/* Email */}
                  <p className="text-xs text-neutral-500">
                    {member?.profile.email}
                  </p>
                </div>

                {/* Actions */}
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="w-4 h-4 text-zinc-500" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side="left">
                          {/* Role Change */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <ShieldQuestion className="w-4 h-4 mr-2" />
                              <span className="text-sm">Role</span>
                            </DropdownMenuSubTrigger>

                            {/* portal */}
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(member.id, "GUEST")
                                  }
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Guest
                                  {member?.role === "GUEST" && (
                                    <CheckCircle className="w-4 h-4 ml-auto text-indigo-400" />
                                  )}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(member.id, "MODERATOR")
                                  }
                                  className="space-x-2 text-indigo-600 dark:text-indigo-400"
                                >
                                  <ShieldCheck className="w-4 h-4 mr-2" />
                                  Moderator
                                  {member?.role === "MODERATOR" && (
                                    <CheckCircle className="w-4 h-4 ml-auto text-indigo-400" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          {/* kick */}
                          <DropdownMenuItem
                            onClick={() => handleKick(member.id)}
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2
                    className="w-4 h-4 ml-auto text-indigo-400 animate-spin"
                    size={24}
                  />
                )}
              </div>
            ))
          }
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
