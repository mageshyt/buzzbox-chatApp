"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { File, X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { Button } from "./ui/button";
// import "@uploadthing/react/styles.css";
interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "serverImage" | "messageFile";
}
export const FileUpload: FC<FileUploadProps> = ({
  endpoint,
  onChange,
  value,
}) => {
  const fileType = value?.split(".").pop();
  if (value && fileType != "pdf")
    return (
      <div className="relative w-20 h-20">
        <Image src={value} fill alt="upload" className="rounded-full" />
        <Button
          className="absolute top-0 right-0 w-6 h-6 p-1 text-white rounded-full hover:bg-rose-500/90 bg-rose-500"
          onClick={() => onChange("")}
          type="button"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );

  if (value && fileType == "pdf")
    return (
      <div className="relative flex items-center p-2 rounded-md bg-zinc-300/20">
        <File className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />

        <a
          href={value}
          target="_blank"
          className="text-indigo-500 hover:text-indigo-600 hover:underline"
        >
          {value.split("/").pop()}
        </a>

        <Button
          className="absolute w-6 h-6 p-1 text-white rounded-full -right-1 -top-1 hover:bg-rose-500/90 bg-rose-500"
          onClick={() => onChange("")}
          type="button"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
