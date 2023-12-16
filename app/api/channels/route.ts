import { currentProfile } from "@/lib/current-profile";
import channelService from "@/services/channel.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });
    const { searchParams } = new URL(req.url);

    const { name, type } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!serverId) throw new NextResponse("ServerId Missing ", { status: 400 });

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });

    if (name === "general") {
      return new NextResponse("Name cannot to be general", { status: 400 });
    }
    

    const channel = await channelService.createChannel(
      serverId,
      profile.id,
      type,
      name
    );

    console.log("[CHANNEL POST ]", channel);

    return new NextResponse(JSON.stringify(channel));
  } catch (error) {
    console.log("[CHANNEL POST]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
