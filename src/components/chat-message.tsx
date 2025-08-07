
"use client";

import { User, RefreshCw } from "lucide-react";
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
import { SukuLogo } from "./suku-logo";
import { Button } from "./ui/button";
import { regenerateResponseAction } from "@/lib/actions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: Message;
  isLastSukuMessage: boolean;
}

export default function ChatMessage({ message, isLastSukuMessage }: ChatMessageProps) {
  const { avatarUrl, messages, replaceLastMessage } = useSession();
  const { isUser, text, emotion } = message;
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const lastUserMessage = messages.filter(m => m.isUser).pop();
    if (!lastUserMessage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find the last user message to regenerate from.",
      });
      setIsRegenerating(false);
      return;
    }
    
    const result = await regenerateResponseAction(lastUserMessage.text);
    if ("error" in result) {
        toast({
            variant: "destructive",
            title: "Regeneration Failed",
            description: result.error,
        });
    } else {
        replaceLastMessage(result);
    }
    setIsRegenerating(false);
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarFallback className="bg-primary/10">
                  <SukuLogo className="size-10" isSmiling={true} />
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

      {!isUser && isLastSukuMessage && (
        <div className="flex self-center opacity-0 transition-opacity group-hover:opacity-100">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="size-8"
                        >
                            <RefreshCw className={cn("size-4", isRegenerating && "animate-spin")} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Regenerate</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      )}
    </div>
  );
}
