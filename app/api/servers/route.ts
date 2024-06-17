import { currentProfile } from "@/lib/current-profile";
import serverService from "@/services/server-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

    if (!profile) throw new NextResponse("Unauthorized", { status: 401 });

    const server = await serverService.createServer(name, imageUrl, profile.id);

    console.log("[SERVER POST ]", server);

    return new NextResponse(JSON.stringify(server), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    console.log("[SERVER POST]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
