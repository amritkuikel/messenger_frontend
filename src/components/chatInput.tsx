"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { messageSchema } from "@/lib/zodschema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  chatId: string;
  userId: number | undefined;
  sendMessage: (message: string) => void;
}

const ChatInput: React.FC<Props> = ({ chatId, userId, sendMessage }) => {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof messageSchema>) {
    if (userId) {
      sendMessage(values.message);
      form.reset();
    } else {
      console.error("User ID is undefined");
    }
  }

  return (
    <div className="p-2 bg-gray-300 dark:bg-gray-700 rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center gap-2">
            <div className="w-[60vw]">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter your message here."
                        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="bg-stone-400 dark:bg-stone-600 hover:bg-stone-700 dark:hover:bg-stone-500"
            >
              Send
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;
