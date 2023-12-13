import { auth } from "@clerk/nextjs";
import pb from "./client";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  const profile = await pb
    .collection("profile")
    .getFirstListItem(`profileId="${userId}"`, {
      signal: undefined,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return profile;
};
