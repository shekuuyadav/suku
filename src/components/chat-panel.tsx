"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "@/contexts/session-context";
import { getVioResponse } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-message";
import { Send } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const chatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function ChatPanel() {
  const { messages, addMessage } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const onSubmit = async (data: ChatFormValues) => {
    const userInput = data.message;
    form.reset();
    setIsLoading(true);

    const userMessage = {
      id: crypto.randomUUID(),
      text: userInput,
      isUser: true,
    };
    addMessage(userMessage);

    const vioResponse = await getVioResponse(userInput, "Calm, indoor setting");
    addMessage(vioResponse);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 p-4 md:p-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background/80 p-4 backdrop-blur-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start gap-4"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Type your message to Vio 3..."
                      className="resize-none"
                      rows={1}
                      disabled={isLoading}
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (form.formState.isValid) {
                            form.handleSubmit(onSubmit)();
                          }
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !form.formState.isValid}
              aria-label="Send message"
            >
              <Send />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
