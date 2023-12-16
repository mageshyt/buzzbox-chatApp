"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "../modals/invite-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { ManageMemberModal } from "../modals/manage-member-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";

export const ModalProvider = () => {
  // Hydration Fix
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <ManageMemberModal />
      <CreateChannelModal />
      <DeleteServerModal />
      <LeaveServerModal />
      <EditChannelModal />
      <DeleteChannelModal />
    </>
  );
};
