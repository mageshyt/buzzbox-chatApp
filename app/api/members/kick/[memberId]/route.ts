import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server.service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const memberId = searchParams.get("memberId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("ServerId Missing ", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("MemberId Missing ", { status: 400 });
    }
    const res = await serverService.kickUser(serverId, memberId, profile.id);

    return new NextResponse(JSON.stringify(res), {
      status: 200,
    });
  } catch (error) {
    console.log("[MEMBER KICK PATCH ERROR]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
