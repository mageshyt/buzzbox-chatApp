import pb, { client } from "@/lib/client";
import { Server } from "@prisma/client";
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

  //! get the user servers

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

  //! get server details
  public async getServerDetail(serverId: string, memberId: string) {
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
        include: {
          channels: {
            orderBy: {
              createdAt: "asc",
            },
          },
          members: {
            include: {
              profile: true,
            },
            orderBy: {
              role: "asc",
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

  //! create a server

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

  // ! generate invite code

  public async generateInviteCode(
    serverId: string,
    profileId: string
  ): Promise<Server> {
    try {
      const server = await client.server.update({
        where: {
          id: serverId,
          profileId: profileId,
        },
        data: {
          inviteCode: uuid(),
        },
      });

      return server;
    } catch (err) {
      console.log(err);

      throw new Error("Error generating invite code");
    }
  }

  // ! join server

  public async joinServer(inviteCode: string, profileId: string) {
    try {
      const server = await client.server.update({
        where: {
          inviteCode: inviteCode,
        },
        data: {
          members: {
            create: [
              {
                profileId: profileId,
              },
            ],
          },
        },
      });

      return server;
    } catch (err) {
      console.log(err);

      throw new Error("Error joining server");
    }
  }

  //! update the server

  public async updateServer(
    serverId: string,
    profileId: string,
    name: string,
    imageUrl: string
  ) {
    try {
      const server = await client.server.update({
        where: {
          id: serverId,
          profileId: profileId,
        },
        data: {
          name,
          imageUrl,
        },
      });

      return server;
    } catch (err) {
      console.log(err);

      throw new Error("Error updating server");
    }
  }
}

export default ServerService.getInstance();
