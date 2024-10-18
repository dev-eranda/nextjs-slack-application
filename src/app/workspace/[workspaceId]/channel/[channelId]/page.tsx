"use client";

import { useChannelId } from "@/app/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useGetMessages } from "@/features/messages/api/use-get-messages.";
import { Loader, TriangleAlert } from "lucide-react";
import { ChatInput } from "./chat-input";
import { Header } from "./header";

const ChannelIdPage = () => {
   const channelId = useChannelId();

   const { results } = useGetMessages({ channelId });
   const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

   console.log({ results });

   if (channelLoading) {
      return (
         <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
            <Loader className="size-5 animate-spin text-muted-foreground" />
         </div>
      );
   }

   if (!channel) {
      return (
         <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
            <TriangleAlert className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Channel not found</span>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full">
         <Header title={channel.name} />
         <div className="flex-1">{JSON.stringify(results)}</div>
         <ChatInput placeholder={`Message # ${channel.name}`} />
      </div>
   );
};

export default ChannelIdPage;
