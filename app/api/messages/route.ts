import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { client } from "@/lib/client";
import messageService from "@/services/message.service";
import { MessageWithMemberProfile } from "@/typings/typing";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    let messages: MessageWithMemberProfile[] | null = [];

    if (cursor) {
      messages = await messageService.getMessagesWithCursor(cursor, channelId);
    } else {
      messages = await messageService.getMessagesWithoutCursor(channelId);
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
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
