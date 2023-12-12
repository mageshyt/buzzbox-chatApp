import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import pb from "./client";

export const initialProfile = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      redirectToSignIn();
    }
    user?.id as string;
    const profile = await pb
      .collection("profile")
      .getFirstListItem(`profileId="${user?.id}"`);

    if (profile) return profile;
    // if no profile, create one
    const newUser = await pb.collection("profile").create({
      profileId: user?.id,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.emailAddresses[0].emailAddress,
      imageUrl: user?.imageUrl,
    });

    return newUser;
  } catch (error: any) {
    console.log(error);
  }
};
