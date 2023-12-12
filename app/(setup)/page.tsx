import { initialProfile } from "@/lib/initial.profile";
import React from "react";

const SetupPage = async () => {
  const profile = await initialProfile();

  console.log(profile);
  return <div>SetupPage</div>;
};

export default SetupPage;
