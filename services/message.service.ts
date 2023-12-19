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

      return null;
    }
  }

  // edit message
  public async editMessage(messageId: string, content: string) {
    try {
      const message = await client.message.update({
        where: {
          id: messageId,
        },
        data: {
          content,
        },
        include:{
          member:{
            include:{
              profile:true
            }
          }
        }
      });

      return message;
    } catch (error) {
      console.log("[MESSAGE_EDIT]", error);

      return null;
    }
  }

  // delete message
  public async deleteMessage(messageId: string) {
    try {
      const message = await client.message.update({
        where: {
          id: messageId,
        },
        data: {
          deleted: true,
          content: "this message is deleted",
          fileUrl: null,
        },
        include:{
          member:{
            include:{
              profile:true
            }
          }
        }
      });

      return message;
    } catch (error) {
      console.log("[MESSAGE_DELETE]", error);

      return null;
    }
  }

  public async getMessage(messageId: string) {
    try {
      const message = await client.message.findUnique({
        where: {
          id: messageId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      return message;
    } catch (error) {
      console.log("[MESSAGE_GET]", error);

      return null;
    }
  }
}

export default MessageService.getInstance();
