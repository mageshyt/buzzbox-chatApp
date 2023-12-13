"use client";

import { Plus } from "lucide-react";
import React from "react";
import ActionTooltip from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal";

const NavigationAction = () => {
  const { openModal } = useModal();
  return (
    <div>
      {/* plus button */}
      <ActionTooltip side="right" align="center" label="Create Server">
        <button
          onClick={() => openModal("createServer")}
          className="flex items-center group"
        >
          <div className="flex transition-all mx-3 h-[48px] w-[48px] bg-background dark:bg-neutral-700 rounded-[25px] items-center justify-center  overflow-hidden group-hover:rounded-[16px] group-hover:bg-emerald-500">
            <Plus
              className="transition group-hover:text-white text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
