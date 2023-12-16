import { currentProfile } from "@/lib/current-profile";
import channelService from "@/services/channel.service";
import { NextResponse } from "next/server";
export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { channelId } = params;
    const { searchParams } = new URL(req.url);

    const profile = await currentProfile();
    const serverId = searchParams.get("serverId");

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) throw new NextResponse("ServerId Missing ", { status: 400 });

    const server = await channelService.deleteChannel(
      channelId,
      serverId,
      profile.id
    );

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
  { params }: { params: { channelId: string } }
) {
  try {
    const { name, type } = await req.json();

    const { channelId } = params;

    const profile = await currentProfile();

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });
    // console.log("[CHANNEL PATCH]", name, type, channelId, profile.id);

    const server = await channelService.updateChannel(
      channelId,
      profile.id,
      name,
      type
    );

    console.log("[CHANNEL PATCH]", server);

    return new NextResponse(JSON.stringify(server), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log("[CHANNEL PATCH]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
