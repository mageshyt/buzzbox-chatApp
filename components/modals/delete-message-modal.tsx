"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import qs from "query-string";

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteMessage";
  const { server, channel, apiUrl, query, name } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl!,
        query: query,
      });

      await axios.delete(url);

      setIsLoading(false);

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden text-black bg-white">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Delete message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="px-2 font-semibold text-indigo-500 transition rounded-md cursor-pointer hover:bg-indigo-400 hover:text-white">
              @{name}
            </span>{" "}
            your message will be deleted permanently.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 bg-gray-100">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
