import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);

if (process.env.NODE_ENV === "development") pb.autoCancellation(false);

export default pb;
// if (process.env.NODE_ENV !== "production")
//   globalThis.PocketBaseClient = PocketBaseClient;
