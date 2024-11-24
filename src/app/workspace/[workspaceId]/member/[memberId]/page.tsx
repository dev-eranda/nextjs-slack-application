"use client";

import { useMemberId } from "@/app/hooks/use-member-id";
import { usePanel } from "@/app/hooks/use-panel";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useCreateOrGetConversation } from "@/features/conversation/api/use-create-or-get-conversation";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
   const memberId = useMemberId();
   const workspaceId = useWorkspaceId();

   const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

   const { mutate, isPending } = useCreateOrGetConversation();

   useEffect(() => {
      mutate(
         { workspaceId, memberId },
         {
            onSuccess(data) {
               setConversationId(data);
            },
            onError() {
               toast.error("Failed to create or get conversation");
            },
         }
      );
   }, [memberId, workspaceId, mutate]);

   if (isPending) {
      return (
         <div className="h-full flex items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
         </div>
      );
   }

   if (!conversationId) {
      return (
         <div className="h-full flex items-center justify-center">
            <AlertTriangle className="size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Conversation not found</span>
         </div>
      );
   }

   return <Conversation id={conversationId} />;
};

export default MemberIdPage;
