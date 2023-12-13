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

  public async getServers(userId: String): Promise<Server[]> {
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
}

export default ServerService.getInstance();
