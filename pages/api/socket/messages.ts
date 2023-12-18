import { client } from "@/lib/client";
import { currentProfilePage } from "@/lib/current-profile-pages";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePage(req);

    const { content, fileUrl } = req.body;

    const { serverId, channelId } = req.query;
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!serverId || !channelId) {
      return res.status(400).json({ message: "Missing serverId or channelId" });
    }

    if (!content) {
      return res.status(400).json({ message: "Missing content" });
    }
    console.log(
      "[MESSAGE POST]",
      profile,
      serverId,
      channelId,
      content,
      fileUrl
    );

    const server = await client.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await client.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await client.message.create({
      data: {
        content,
        channelId: channel.id as string,
        memberId: member.id as string,
        fileUrl: fileUrl || undefined,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    console.log("[MESSAGE POST]", message);

    // Emit message to all members of the server

    const channelKey = `server:${server.id}:channel:${channel.id}`;

    req?.socket?.server?.io?.emit(channelKey, message);

    res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE POST]", error);
    res.status(500).json({ message: "Internal Error" });
  }
}
