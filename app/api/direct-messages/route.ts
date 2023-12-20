import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import messageService from "@/services/message-service";
import { MessageWithMemberProfile } from "@/typings/typing";
import { DirectMessage, Member, Profile } from "@prisma/client";
import directMessageService from "@/services/direct-message-service";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("conversationId ID missing", { status: 400 });
    }

    let messages: DirectMessage[] | null = [];

    if (cursor) {
      messages = await directMessageService.getMessagesWithCursor(
        cursor,
        conversationId
      );
    } else {
      messages = await directMessageService.getMessagesWithoutCursor(
        conversationId
      );
    }

    if (!messages) {
      return new NextResponse("Internal Error", { status: 500 });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
