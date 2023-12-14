import pb from "@/lib/client";
import { Server } from "@/typings/typing";

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

  //   get the user servers

  public async getServers(userId: string): Promise<Server[]> {
    try {
      const response: any = await pb.collection("Server").getFullList({
        filter: `profileId="${userId}"`,
      });

      return response as Server[];
    } catch (err) {
      console.log(err);

      throw new Error("Error getting servers");
    }
  }

  // get server details
  public async getServer(serverId: string, memberId: string): Promise<Server> {
    try {
      //  only the members of the server can get the server details
      const response: any = await pb
        .collection("Server")
        .getOne(serverId, {
          expand: "members",
        })
        .then((res) => res)
        .catch((err) => {
          console.log(err);
          return null;
        });

      return response as Server;
    } catch (err) {
      console.log(err);

      throw new Error("Error getting server");
    }
  }
}

export default ServerService.getInstance();
