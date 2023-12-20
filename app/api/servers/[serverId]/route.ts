import pb from "@/lib/client";
import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server-service";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;

    const profile = await currentProfile();

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) throw new NextResponse("ServerId Missing ", { status: 400 });

    const server = await serverService.deleteServer(serverId, profile.id);

    console.log("[SERVER DELETE]", server);

    return new NextResponse(JSON.stringify(server), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log("[SERVER DELETE]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { name, imageUrl } = await req.json();

    const { serverId } = params;

    const profile = await currentProfile();

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });

    const server = await serverService.updateServer(
      serverId,
      profile.id,
      name,
      imageUrl
    );

    console.log("[SERVER PATCH]", server);

    return new NextResponse(JSON.stringify(server), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log("[SERVER PATCH]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
