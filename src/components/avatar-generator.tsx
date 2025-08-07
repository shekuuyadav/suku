"use client";

import React, { useState } from "react";
import { useSession } from "@/contexts/session-context";
import { generateAvatarAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, User, Link, Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function AvatarGenerator() {
  const { avatarUrl, setAvatarUrl, interactionHistory } = useSession();
  const { toast } = useToast();
  const [customUrl, setCustomUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateAvatarAction(interactionHistory);
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Avatar Generation Failed",
        description: result.error,
      });
    } else {
      setAvatarUrl(result.avatarDataUri);
      toast({
        title: "Avatar Generated!",
        description: "Your new avatar is ready.",
      });
    }
    setIsGenerating(false);
  };

  const handleSetCustomUrl = () => {
    if (customUrl) {
      try {
        new URL(customUrl);
        setAvatarUrl(customUrl);
        toast({ title: "Avatar Updated", description: "Your custom avatar has been set."});
      } catch (error) {
        toast({ variant: "destructive", title: "Invalid URL", description: "Please enter a valid image URL."});
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="flex flex-col items-center justify-center space-y-4 md:col-span-1">
        <p className="text-sm font-medium text-center">Current Avatar</p>
        <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-md">
          <AvatarImage src={avatarUrl} alt="User Avatar" />
          <AvatarFallback className="text-muted-foreground">
            <User className="h-16 w-16" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-6 md:col-span-2">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="custom-url" className="flex items-center gap-2"><Link className="size-4" /> Use a custom avatar URL</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-url"
                  placeholder="https://example.com/image.png"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <Button onClick={handleSetCustomUrl} variant="secondary">Set</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3 text-center md:text-left">
              <Label className="flex items-center justify-center md:justify-start gap-2"><Sparkles className="size-4 text-accent"/>Let Vio 3 generate an avatar</Label>
              <p className="text-sm text-muted-foreground">
                Based on your chat history, Vio 3 can create a unique avatar that reflects your personality.
              </p>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
