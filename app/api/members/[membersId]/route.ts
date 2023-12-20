import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server-service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: Request, params: { membersId: string }) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const { role } = await req.json();
    const serverId = searchParams.get("serverId");
    const memberId = searchParams.get("memberId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("ServerId Missing ", { status: 400 });
    }

    if (!role) {
      return new NextResponse("Role Missing ", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("MemberId Missing ", { status: 400 });
    }
    // console.log("[MEMBER ROLE PATCH]", params);
    const res = await serverService.changeRole(
      serverId,
      memberId,
      profile.id,
      role
    );

    return new NextResponse(JSON.stringify(res), {
      status: 200,
    });
  } catch (error) {
    console.log("[MEMBER ROLE PATCH ERROR]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
