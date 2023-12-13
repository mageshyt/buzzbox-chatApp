import pb from "@/lib/client";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });

    const server = await pb.collection("server").create({
      name,
      imageUrl,
      profileId: profile.id,
      inviteCode: uuid(),
      profile: profile.id,
    });

    console.log("[SERVER POST ]", server);

    // create general channel
    const channel = await pb.collection("channel").create({
      name: "general",
      serverId: server.id,
      profileId: profile.id,
      profile: profile.id,
      server: server.id,
      channelType: "TEXT",
    });

    console.log("[SERVER POST CHANNEL]", channel);

    // create member
    const member = await pb.collection("member").create({
      profileId: profile.id,
      serverId: server.id,
      profile: profile.id,
      server: server.id,
      role: "ADMIN",
    });

    console.log("[SERVER POST MEMBER]", member);

    // update the server
    const result = await pb.collection("server").update(server.id, {
      "members+": member.id,
      "channels+": channel.id,
    });
    return new NextResponse(JSON.stringify(result), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log("[SERVER POST]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
