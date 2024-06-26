"use client";

import qs from "query-string";
import ActionTooltip from "./action-tooltip";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOff : Video;

  const tooltipLabel = isVideo ? "Turn off video" : "Turn on video";

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };
  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button
        onClick={handleClick}
        className="p-1 mr-4 transition rounded-md hover:opacity-75 "
      >
        <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
