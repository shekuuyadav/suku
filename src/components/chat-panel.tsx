
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "@/contexts/session-context";
import { getVioResponseAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-message";
import { Send } from "lucide-react";
import { SukuLogo } from "./suku-logo";
import { useToast } from "@/hooks/use-toast";

const chatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function ChatPanel() {
  const { messages, addMessage } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    const view = scrollAreaRef.current?.querySelector('div');
    if (view) {
      view.scrollTo({
        top: view.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

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

    const vioResponse = await getVioResponseAction(userInput, "Calm, indoor setting");
    if ("error" in vioResponse) {
        toast({
            variant: "destructive",
            title: "Error",
            description: vioResponse.error,
        });
    } else {
        addMessage(vioResponse);
    }
    setIsLoading(false);
  };

  const lastSukuMessageId = messages.filter(m => !m.isUser).pop()?.id;

  return (
    <div className="flex h-full flex-1 flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 p-4 md:p-6">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isLastSukuMessage={!message.isUser && message.id === lastSukuMessageId && !isLoading}
            />
          ))}
          {isLoading && (
             <div className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center">
                    <SukuLogo className="size-10" />
                </div>
                <div className="max-w-md rounded-lg rounded-bl-none bg-secondary px-4 py-3 text-secondary-foreground">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        Suku is typing
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current delay-0" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current delay-150" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current delay-300" />
                    </div>
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
                      placeholder="Type your message to Suku..."
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
