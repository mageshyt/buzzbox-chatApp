export interface Profile {
  name: string;
  id: string;
  profileId: string;
  imageUrl: string;
}

export interface Server {
  name: string;
  id: string;
  profileId: string;
  imageUrl: string;
  profile: Profile[];
  inviteCode: string;
}
