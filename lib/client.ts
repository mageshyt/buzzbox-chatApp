// import { Client } from "appwrite";

// const PocketBaseClient = new Client();

// PocketBaseClient.setEndpoint("https://cloud.appwrite.io/v1").setProject(
//   "65787497b8e0113b62d7"
// );

// declare global {
//   var PocketBaseClient: PocketBase | any;
// }

import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL,
    
    );

if (process.env.NODE_ENV === "development") pb.autoCancellation(false);

export default pb;
// if (process.env.NODE_ENV !== "production")
//   globalThis.PocketBaseClient = PocketBaseClient;
