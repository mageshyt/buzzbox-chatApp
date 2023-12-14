import { auth } from "@clerk/nextjs";
import { client } from "./client";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  const profile = client.profile.findUnique({
    where: { userId: userId },
  });

  return profile;
};
