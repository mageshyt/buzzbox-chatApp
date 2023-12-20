import { client } from "@/lib/client";
import { currentProfilePage } from "@/lib/current-profile-pages";
import directMessageService from "@/services/direct-message-service";
import { MemberRole } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check HTTP method
  if (!["DELETE", "PATCH"].includes(req.method as string)) {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePage(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    // Authentication and validation checks
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const conversation = await client.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check if the user is a member of the server
    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let message = await directMessageService.getMessage(
      directMessageId as string,
      conversationId as string
    );

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Handle PATCH request

    if (req.method === "PATCH") {
      if (!content) {
        return res.status(400).json({ error: "Missing content" });
      }

      message = await directMessageService.editMessage(
        directMessageId as string,
        content
      );
    }
    if (req.method === "DELETE") {
      message = await directMessageService.deleteMessage(
        directMessageId as string
      );
    }

    // Emit update event to socket
    const updateKey = `chat:${directMessageId}:messages:update`;
    // @ts-ignore
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
}
