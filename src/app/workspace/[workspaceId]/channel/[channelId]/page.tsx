"use client";

import { useChannelId } from "@/app/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { Loader, TriangleAlert } from "lucide-react";
import { Header } from "./header";

const ChannelIdPage = () => {
   const channelId = useChannelId();

   const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

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
      </div>
   );
};

export default ChannelIdPage;
