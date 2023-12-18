"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";

import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

import { useModal } from "@/hooks/use-modal";

const formScheme = z.object({
  fileUrl: z.string().min(1, {
    message: "Please provide an image url",
  }),
});

export const MessageFileUploadModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();

  const { apiUrl, query } = data;

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    defaultValues: {
      fileUrl: "",
    },
    resolver: zodResolver(formScheme),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      // reset the form
      form.reset();

      router.refresh();

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden text-black bg-white">
        {/* Header */}
        <DialogHeader className="px-6 pt-8">
          {/* Title */}
          <DialogTitle className="text-2xl font-bold text-center">
            Add a attachment
          </DialogTitle>
          {/* Description */}
          <DialogDescription className="mt-4 text-center">
            send a file to your friends
          </DialogDescription>
          {/* Form */}
        </DialogHeader>

        {/* Form */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="p-4">
              {/* image upload */}
              <div className="flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="px-6 py-3 bg-gray-100 ">
              <Button variant="primary" disabled={isLoading}>
                send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
