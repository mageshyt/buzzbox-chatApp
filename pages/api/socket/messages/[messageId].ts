import { client } from "@/lib/client";
import { currentProfilePage } from "@/lib/current-profile-pages";
import channelService from "@/services/channel.service";
import messageService from "@/services/message.service";
import serverService from "@/services/server.service";
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
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    // Authentication and validation checks
    if (!profile || !serverId || !channelId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const server = await serverService.getServerDetail(
      serverId as string,
      profile.id
    );

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    const channel = await channelService.getChannelDetails(
      channelId as string,
      serverId as string,
      profile.id
    );

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Check if the user is a member of the server
    const member = server.members.find((m) => m.profileId === profile.id);

    if (!member) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let message = await messageService.getMessage(messageId as string);

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

      message = await messageService.editMessage(messageId as string, content);
    }
    if (req.method === "DELETE") {
      message = await messageService.deleteMessage(messageId as string);
    }

    // Emit update event to socket
    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
}
