"use client";

import { FC, useEffect, useState } from "react";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Loader from "./Loader";

interface MediaRoomProps {
  chatId: string;
  mediaType: "audio" | "video";
}

const MediaRoom: FC<MediaRoomProps> = ({ chatId, mediaType }) => {
  const { user } = useUser();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const res = await fetch(
          `/api/livekit?room=${chatId}&username=${name}&type=${mediaType}`
        );
        const data = await res.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId, mediaType]);

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={mediaType === "video"}
      audio={mediaType === "audio"}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
