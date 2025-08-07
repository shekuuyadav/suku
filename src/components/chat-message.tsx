"use client";

import { Bot, User } from "lucide-react";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/contexts/session-context";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { avatarUrl } = useSession();
  const { isUser, text, emotion } = message;

  return (
    <div
      className={cn(
        "flex items-start gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {emotion && (
              <TooltipContent side="right">
                <p className="font-semibold">{emotion.emotionalState}</p>
                <p>Confidence: {Math.round(emotion.confidenceLevel * 100)}%</p>
                <p className="max-w-xs text-muted-foreground">
                  Reason: {emotion.reason}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}

      <div
        className={cn(
          "max-w-md rounded-lg px-4 py-3",
          isUser
            ? "rounded-br-none bg-primary text-primary-foreground"
            : "rounded-bl-none bg-secondary text-secondary-foreground"
        )}
      >
        <p className="text-sm">{text}</p>
      </div>

      {isUser && (
        <Avatar className="h-10 w-10 border-2 border-accent/50">
          <AvatarImage src={avatarUrl} alt="User Avatar" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
