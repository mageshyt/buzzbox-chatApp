import { client } from "@/lib/client";
import { Message } from "@prisma/client";

class MessageService {
  private static instance: MessageService;

  private MESSAGES_BATCH = 10;

  private constructor() {}

  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  // get message without cursor

  public async getMessagesWithoutCursor(channelId: string) {
    try {
      const messages = await client.message.findMany({
        take: this.MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return messages;
    } catch (error) {
      console.log("[MESSAGES_GET]", error);

      return null;
    }
  }

  // get message with cursor

  public async getMessagesWithCursor(cursor: string, channelId: string) {
    try {
      const messages = await client.message.findMany({
        take: this.MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return messages;
    } catch (error) {
      console.log("[MESSAGES_GET]", error);

      return null
    }
  }
}

export default MessageService.getInstance();
