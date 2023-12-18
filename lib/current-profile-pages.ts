import { getAuth} from "@clerk/nextjs/server";
import { client } from "./client";
import { NextApiRequest } from "next";

export const currentProfilePage = async (req:NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) throw new Error("Unauthorized");

  const profile = client.profile.findUnique({
    where: { userId: userId },
  });

  return profile;
};
