import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server-service";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { serverId: string };
  }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    const { serverId } = params;

    const server = await serverService.generateInviteCode(serverId, profile.id);

    return new NextResponse(JSON.stringify(server), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("[SERVER_ID]", error);

    return new NextResponse("internal server error", { status: 500 });
  }
}
