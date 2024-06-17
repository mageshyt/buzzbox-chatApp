import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { client } from "./client";
import { currentProfile } from "./current-profile";

export const initialProfile = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      redirectToSignIn();
    }

    const profile = await client.profile.findUnique({
      where: { userId: user?.id },
    });

    if (profile) return profile;
    // if no profile, create one
    const newUser = await client.profile.create({
      data: {
        userId: user?.id as string,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.emailAddresses[0].emailAddress as string,
        imageUrl: user?.imageUrl as string,
      },
    });

    return newUser;
  } catch (error: any) {
    console.log(error);
  }
};
