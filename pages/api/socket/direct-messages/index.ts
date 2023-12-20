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

    const { conversationId } = req.query;
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!conversationId) {
      return res
        .status(400)
        .json({ message: "Missing serverId or conversationId" });
    }

    if (!content) {
      return res.status(400).json({ message: "Missing content" });
    }
    // console.log("[MESSAGE POST]", profile, conversationId, content, fileUrl);

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

    // console.log("[MESSAGE POST]", conversation);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await client.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    // console.log("[MESSAGE POST]", message);

    // Emit message to all members of the server

    const channelKey = `chat:${conversationId}:messages`;
    // @ts-ignore
    req?.socket?.server?.io?.emit(channelKey, message);

    res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE POST]", error);
    res.status(500).json({ message: "Internal Error" });
  }
}
