import { Member, Message, Profile, Server } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";
export interface Profile {
  name: string;
  id: string;
  profileId: string;
  imageUrl: string;
}

export type ServerWithMembersAndProfile = Server & {
  members: (Member & { profile: Profile })[]; // Add a semicolon here
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};

export type MessageWithMemberProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};


