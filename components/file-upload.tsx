"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
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
  console.log(fileType);
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
