import pb, { client } from "@/lib/client";
import { ChannelType, MemberRole, Server } from "@prisma/client";
import { v4 as uuid } from "uuid";

class ChannelService {
  private static instance: ChannelService | null = null;
  // Singleton pattern to ensure only one instance of the service
  static getInstance(): ChannelService {
    if (!this.instance) {
      this.instance = new ChannelService();
    }
    return this.instance;
  }

  private constructor() {
    console.log("ChannelService created 🤖");
  }

  //   ! create a channel
  public async createChannel(
    serverId: string,
    profileId: string,
    type: ChannelType,
    name: string
  ) {
    try {
      const server = await client.server.update({
        where: {
          id: serverId,
          members: {
            some: {
              profileId,
              role: {
                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
              },
            },
          },
        },
        data: {
          channels: {
            create: {
              name,
              type,
              profileId,
            },
          },
        },
      });

      return server;
    } catch (err) {
      console.log(err);

      throw new Error("Error creating channel");
    }
  }
}

export default ChannelService.getInstance();