"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formScheme = z.object({
  name: z
    .string()
    .min(3, {
      message: "Server name required",
    })
    .refine((name) => name !== "general", {
      message: "channel name cannot be general",
    }),

  type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
  const style = {
    label: "text-xs font-bold text-zinc-500 dark:text-secondary/70",
    input:
      "text-black border-0 bg-zinc-200/60 focus-visible:ring-0 focus-visible:ring-offset-0",
  };

  const { isOpen, onClose, type, data } = useModal();

  const { channel, server } = data;

  const router = useRouter();

  const isModelOpen = isOpen && type === "editChannel";

  const form = useForm({
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
    resolver: zodResolver(formScheme),
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [channel, form]);

  const isLoading = form.formState.isSubmitting;
  //! handle submit
  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
          ...values,
        },
      });

      await axios.patch(url, values);

      // reset the form
      form.reset();

      router.refresh();

      // close the modal

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  // ! handle close

  const handleClose = () => {
    onClose();
    form.reset();
  };
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden text-black bg-white">
        {/* Header */}
        <DialogHeader className="px-6 pt-8">
          {/* Title */}
          <DialogTitle className="text-2xl font-bold text-center">
            Edit Channel
          </DialogTitle>
        </DialogHeader>

        {/* Form */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="p-4 space-y-2">
              {/* formField */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={style.label}>Channel Name</FormLabel>

                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className={style.input}
                        placeholder="Enter your Channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-500" />
                  </FormItem>
                )}
              />

              {/* select channel Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={style.label}>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={style.input}>
                          {/* <SelectValue>Select Channel Type</SelectValue> */}
                          <SelectValue
                            placeholder={field.value || "Select Channel Type"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
