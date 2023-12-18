"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal";
import { EmojiPicker } from "@/components/emoji-picker";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const fontSchema = z.object({
  content: z.string().min(1).max(2000),
});

const ChatInput: FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {
  const style = {
    button:
      "absolute top-7 left-8 h-6 w-6 flex items-center justify-center bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300/30 rounded-full  p-1 transition-all duration-200 ease-in-out",

    input:
      "bg-zinc-200/90 dark:bg-zinc-700/70 border-none   focus-visible:ring-0 focus-visible:ring-offset-0 px-14 py-6",
  };

  const { openModal } = useModal();
  const form = useForm<z.infer<typeof fontSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(fontSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, data);

      form.reset();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  {/* add media modal */}
                  <button
                    onClick={() => openModal("messageFile", { apiUrl, query })}
                    className={style.button}
                    type="button"
                  >
                    <Plus className="text-white dark:text-[#31338]" />
                  </button>

                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder={`Message ${
                      type === "conversation" ? name : "# " + name
                    }`}
                    className={style.input}
                  />
                  {/* emoji modal */}
                  <div className="absolute right-8 top-7">
                    {/* <Smile /> */}
                    <EmojiPicker
                      onChange={(emoji) => {
                        form.setValue("content", field.value + emoji);
                      }}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
