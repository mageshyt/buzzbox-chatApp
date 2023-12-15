"use client";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useModal } from "@/hooks/use-modal";
import { useOrigin } from "@/hooks/use-origin";

import { Check, Copy, RefreshCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const InviteModal = () => {
  const style = {
    content: "p-0 overflow-hidden text-black bg-white",
    title: "text-2xl font-bold text-center",
    label:
      "uppercase text-sm font-semibold text-zinc-500 dark:text-secondary/70",
    input:
      "bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black",
    icon: "w-4 h-4 ",
  };

  const origin = useOrigin();
  const { isOpen, onClose, type, data, openModal } = useModal();

  const server = data?.server;

  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(false);

  const isModelOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  // ! method to copy invite link

  const copyInviteLink = () => {
    if (copied) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const generateNewLink = async () => {
    try {
      setLoading(true);
      // ! generate new link
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      openModal("invite", { server: res.data });
    } catch (error) {
      console.log("👉 [GenerateLink |Error]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={style.content}>
        {/* Header */}
        <DialogHeader className="px-6 pt-8">
          {/* Title */}
          <DialogTitle className={style.title}>
            Invite People to BuzzBox
          </DialogTitle>
        </DialogHeader>
        {/* Body */}
        <div className="p-6">
          <Label className={style.label}> Server Invite Link</Label>
          {/* Invite link */}
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={loading}
              className={style.input}
              value={inviteUrl}
            />
            {/* copy btn */}
            <Button disabled={loading} onClick={copyInviteLink} size="icon">
              {copied ? (
                <Check
                  className={cn(
                    style.icon,
                    "text-green-400 transform font-bold  scale-110 ease-in duration-300 "
                  )}
                />
              ) : (
                <Copy className={style.icon} />
              )}
            </Button>
          </div>

          {/* generate new link */}
          <Button
            variant={"link"}
            disabled={loading}
            onClick={generateNewLink}
            size={"sm"}
            className="mt-4 text-xs text-zinc-500"
          >
            Generate New Link
            <RefreshCcw className={cn(style.icon, "ml-2")} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
