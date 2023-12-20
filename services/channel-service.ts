import { client } from "@/lib/client";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";

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
    // console.log("ChannelService created 🤖",);
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

  // ! update a channel

  public async updateChannel(
    channelId: string,
    profileId: string,
    name: string,
    type: ChannelType
  ) {
    try {
      const channel = await client.channel.update({
        where: {
          id: channelId,
          profileId,
        },
        data: {
          name,
          type,
        },
      });

      return channel;
    } catch (err) {
      console.log(err);

      throw new Error("Error updating channel");
    }
  }

  // ! delete a channel
  public async deleteChannel(
    channelId: string,
    serverId: string,
    profileId: string
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
            delete: {
              id: channelId,
            },
          },
        },
      });

      return server;
    } catch (err) {
      console.log(err);

      throw new Error("Error deleting channel");
    }
  }

  // ! get channel details

  public async getChannelDetails(
    channelId: string,
    serverId: string,
    profileId: string
  ) {
    try {
      const channel = await client.channel.findUnique({
        where: {
          id: channelId,
        },
        include: {},
      });

      const member = await client.member.findFirst({
        where: {
          serverId: serverId,
          profileId,
        },
      });

      return [channel, member];
    } catch (error) {
      console.log("CLIENT SERVICE ERROR", error);
      throw new Error("Error in getting channel");
    }
  }
}

const channelService = ChannelService.getInstance();
export default channelService;
