import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Member, Message, Profile } from "@prisma/client";

import { useSocket } from "@/components/providers/socket-provider";
import { MessageWithMemberProfile } from "@/typings/typing";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket(); // Retrieves the socket from the context provided by the useSocket hook.
  const queryClient = useQueryClient(); // Retrieves the query client from react-query.

  useEffect(() => {
    if (!socket) return; // If socket is not available, do nothing.

    // Handles socket events for message updates.
    socket.on(updateKey, (msg: MessageWithMemberProfile) => {
      queryClient.setQueryData<MessageWithMemberProfile[]>(
        [queryKey],
        (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) return;

          // Updates the data in the query client based on the received message.
          const newData = oldData.pages.map((page: any) => {
            return {
              ...page,
              items: page.messages.map((message: MessageWithMemberProfile) => {
                if (message.id === msg.id) {
                  return msg;
                }
                return message;
              }),
            };
          });

          return {
            ...oldData,
            pages: newData,
          };
        }
      );
    });

    // Handles socket events for new messages.
    socket.on(addKey, (msg: MessageWithMemberProfile) => {
      queryClient.setQueryData<MessageWithMemberProfile[]>(
        [queryKey],
        (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            // If there is no existing data, initializes a new data structure.
            return {
              pages: [
                {
                  items: [msg],
                },
              ],
            };
          }

          // Updates the data in the query client by adding the new message.
          const newData = [...oldData.pages];

          newData[0] = {
            ...newData[0],
            items: [msg, ...newData[0].items],
          };

          return {
            ...oldData,
            pages: newData,
          };
        }
      );
    });

    // Cleans up event listeners when the component unmounts.
    return () => {
      socket.off(updateKey);
      socket.off(addKey);
    };
  }, []); // Effect runs once on mount.
};
