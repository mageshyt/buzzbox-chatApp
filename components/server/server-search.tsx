"use client";
import { Search } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

const ServerSearch: FC<ServerSearchProps> = ({ data }) => {
  const style = {
    button:
      "group px-2 py-2 rounded-md flex transition items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
    icon: "w-4 h-4 text-zinc-500 dark:text-zinc-400",
    text: "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
    command:
      "bg-muted px-1.5 rounded-md gap-1 pointer-events-none h-5 inline-flex items-center border font-mono text-[10px] font-medium text-muted-foreground ml-auto",
  };

  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);

  const handleClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);
    if (type === "member") {
      return router.push(`/servers/${params?.serverId}/members/${id}`);
    }
    if (type === "channel")
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
  };

  return (
    <>
      <button onClick={() => setOpen((prev) => !prev)} className={style.button}>
        <Search className={style.icon} />
        <p className={style.text}>search</p>
        <kbd className={style.command}>
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>
            <p className="text-muted-foreground">No results found</p>
          </CommandEmpty>

          {data.map(({ data, label, type }) => {
            if (!data) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ icon, name, id }) => {
                  return (
                    <CommandItem
                      onSelect={() => handleClick({ id, type })}
                      key={id}
                    >
                      {icon}
                      <p className="">{name}</p>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
