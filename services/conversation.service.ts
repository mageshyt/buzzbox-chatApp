import { client } from "@/lib/client";

class ConversationService {
  private static instance: ConversationService;

  public static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }

    return ConversationService.instance;
  }

  private constructor() {
    console.log("conversation Service created  ✅");
  }

  async getConversations(memberOneId: string, memberTwoId: string) {
    try {
      console.log("memberOneId", memberOneId);
      console.log("memberTwoId", memberTwoId);

      //   console.log(await client.server.count());
      const conversations = await client.conversation.findFirst({
        where: {
          AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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

      return conversations;
    } catch (error) {
      console.log("CONVERSATION SERVICE ERROR", error);

      return null;
    }
  }

  async createConversation(memberOneId: string, memberTwoId: string) {
    try {
      console.log("memberOneId", memberOneId);
      console.log("memberTwoId", memberTwoId);
      const conversation = await client.conversation.create({
        data: {
          memberOneId: memberOneId,
          memberTwoId: memberTwoId,
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
      return conversation;
    } catch (error) {
      console.log("CONVERSATION SERVICE ERROR", error);

      return null;
    }
  }

  async getOrCreateConversation(memberOneId: string, memberTwoId: string) {
    //  try two ways to get the conversation
    let conversations =
      (await this.getConversations(memberOneId, memberTwoId)) ||
      (await this.getConversations(memberTwoId, memberOneId));

    console.log("conversations", conversations);
    // if no conversation, create one
    if (!conversations) {
      conversations = await this.createConversation(memberOneId, memberTwoId);
    }

    return conversations;
  }
}

export const conversationService = ConversationService.getInstance();
