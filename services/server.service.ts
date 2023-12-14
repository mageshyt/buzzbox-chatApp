import pb, { client } from "@/lib/client";
import { Server } from "@/typings/typing";
import { v4 as uuid } from "uuid";

class ServerService {
  private static instance: ServerService | null = null;
  // Singleton pattern to ensure only one instance of the service
  static getInstance(): ServerService {
    if (!this.instance) {
      this.instance = new ServerService();
    }
    return this.instance;
  }

  private constructor() {
    console.log("Service created 🤖");
  }

  //* get the user servers

  public async getServers(userId: string): Promise<Server[]> {
    try {
      const servers = await client.server.findMany({
        where: {
          members: {
            some: {
              profileId: userId,
            },
          },
        },
        include: {
          members: {
            include: {
              profile: true,
            },
          },
        },
      });

      return servers;
    } catch (err) {
      console.log(err);

      throw new Error("Error getting servers");
    }
  }

  //* get server details
  public async getServer(serverId: string, memberId: string) {
    try {
      const server = await client.server.findFirst({
        where: {
          id: serverId,
          members: {
            some: {
              profileId: memberId,
            },
          },
        },
      });

      return server;
    } catch (err) {
      console.log(err);

      throw new Error("Error getting server");
    }
  }

  //* create a server

  public async createServer(
    name: string,
    imageUrl: string,
    profileId: string
  ): Promise<Server> {
    try {
      const server = await client.server.create({
        data: {
          name,
          imageUrl,
          profileId,
          inviteCode: uuid(),
          channels: {
            create: [
              {
                name: "general",
                type: "TEXT",
                profileId,
              },
            ],
          },
          members: {
            create: [
              {
                profileId,
                role: "ADMIN",
              },
            ],
          },
        },
      });

      return server;
    } catch (err) {
      console.log(err);
      throw new Error("Error creating server");
    }
  }
}

export default ServerService.getInstance();
