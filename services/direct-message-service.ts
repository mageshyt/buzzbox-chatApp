import { client } from "@/lib/client";
import { Message } from "@prisma/client";

class DirectMessageService {
  private static instance: DirectMessageService;

  private MESSAGES_BATCH = 10;

  private constructor() {}

  public static getInstance(): DirectMessageService {
    if (!DirectMessageService.instance) {
      DirectMessageService.instance = new DirectMessageService();
    }
    return DirectMessageService.instance;
  }

  // get message without cursor

  public async getMessagesWithoutCursor(conversationId: string) {
    try {
      const messages = await client.directMessage.findMany({
        take: this.MESSAGES_BATCH,
        where: {
          conversationId,
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

  public async getMessagesWithCursor(cursor: string, conversationId: string) {
    try {
      const messages = await client.directMessage.findMany({
        take: this.MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      console.log("[MESSAGE_EDIT]", messageId, content);
      const message = await client.directMessage.update({
        where: {
          id: messageId,
        },
        data: {
          content,
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
      console.log("[MESSAGE_EDIT]", error);

      return null;
    }
  }

  // delete message
  public async deleteMessage(messageId: string) {
    try {
      const message = await client.directMessage.update({
        where: {
          id: messageId,
        },
        data: {
          deleted: true,
          content: "this message is deleted",
          fileUrl: null,
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
      console.log("[MESSAGE_DELETE]", error);

      return null;
    }
  }

  public async getMessage(messageId: string, conversationId: string) {
    try {
      const message = await client.directMessage.findUnique({
        where: {
          id: messageId,
          conversationId,
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

const directMessageService = DirectMessageService.getInstance();

export default directMessageService;
