export interface Profile {
  name: String;
  id: String;
  profileId: String;
  imageUrl: String;
}

export interface Server {
  name: String;
  id: String;
  profileId: String;
  imageUrl: String;
  profile: Profile[];
  inviteCode: String;
}
