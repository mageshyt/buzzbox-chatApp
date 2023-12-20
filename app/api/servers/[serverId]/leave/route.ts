import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server-service";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;

    const profile = await currentProfile();

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) throw new NextResponse("ServerId Missing ", { status: 400 });

    const server = await serverService.leaveServer(serverId, profile.id);

    console.log("[SERVER LEAVE PATCH]", server);

    return new NextResponse(JSON.stringify(server), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log("[SERVER LEAVE PATCH]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
