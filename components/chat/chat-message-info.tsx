import { MemberRole } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { FC } from "react";
import ActionTooltip from "../action-tooltip";

interface UserDetailsProps {
  name: string;
  role: MemberRole;
  timestamp: string;
  onMemberClick: () => void;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const style = {
  profileName: "font-semibold text-sm hover:underline cursor-pointer",
  timeStamp: "text-xs text-zinc-500 dark:text-zinc-400",
};

export const MessageInfoDisplay: FC<UserDetailsProps> = ({
  name,
  role,
  timestamp,
  onMemberClick,
}) => (
  <div className="flex space-x-3">
    {/* Name */}
    <p onClick={onMemberClick} className={style.profileName}>
      {name}
    </p>
    {/* Role */}
    <ActionTooltip label={role}>{roleIconMap[role]}</ActionTooltip>

    {/* Time */}
    <p className={style.timeStamp}>{timestamp}</p>
  </div>
);
