"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
const formScheme = z.object({
  name: z
    .string()
    .min(3, {
      message: "Server name required",
    })
    .max(32),
  imageUrl: z.string().min(1, {
    message: "Please provide an image url",
  }),
});

export const InitialModal = () => {
  // ! Handle Hydration
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    resolver: zodResolver(formScheme),
  });

  const isLoading = form.formState.isSubmitting;

  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    try {
      await axios.post("/api/servers", values);

      // reset the form
      form.reset();

      router.refresh();

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) return null;
  return (
    <Dialog open>
      <DialogContent className="p-0 overflow-hidden text-black bg-white">
        {/* Header */}
        <DialogHeader className="px-6 pt-8">
          {/* Title */}
          <DialogTitle className="text-2xl font-bold text-center">
            Customize your profile
          </DialogTitle>
          {/* Description */}
          <DialogDescription className="mt-4 text-center">
            Give your server a personality by adding name and image. you can
            always change this later.
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
                  name="imageUrl"
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
              {/* formField */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="text-black border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter your server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-3 bg-gray-100 ">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
