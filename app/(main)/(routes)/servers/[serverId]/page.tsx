import { client } from "@/lib/client";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import  { FC } from "react";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}
const serverIdPage: FC<ServerIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();
  console.log(profile);

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await client.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },

    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];
  console.log("👉 channel", initialChannel);

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default serverIdPage;
