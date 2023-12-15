import { Member, Profile, Server } from "@prisma/client";

export interface Profile {
  name: string;
  id: string;
  profileId: string;
  imageUrl: string;
}

export type ServerWithMembersAndProfile = Server & {
  members: (Member & { profile: Profile })[]; // Add a semicolon here
};
