
"use client";

import type { Message } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SessionContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  replaceLastMessage: (message: Message) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  interactionHistory: string;
  lastEmotion: string | null;
  setLastEmotion: (emotion: string | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "suku-intro",
      text: "Hello, I'm Suku. I'm here to listen and understand. What's on your mind?",
      isUser: false,
    },
  ]);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://placehold.co/128x128.png"
  );
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    if (!message.isUser && message.emotion) {
      setLastEmotion(message.emotion.emotionalState.toLowerCase());
    }
  };

  const replaceLastMessage = (message: Message) => {
    setMessages(prev => {
        const newMessages = [...prev];
        const lastSukuIndex = newMessages.map(m => !m.isUser).lastIndexOf(true);
        if (lastSukuIndex !== -1) {
            newMessages[lastSukuIndex] = message;
        }
        return newMessages;
    });
    if (!message.isUser && message.emotion) {
      setLastEmotion(message.emotion.emotionalState.toLowerCase());
    }
  }

  const interactionHistory = messages
    .map((m) => `${m.isUser ? "User" : "Suku"}: ${m.text}`)
    .join("\n");

  const value = {
    messages,
    addMessage,
    replaceLastMessage,
    avatarUrl,
    setAvatarUrl,
    interactionHistory,
    lastEmotion,
    setLastEmotion,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
