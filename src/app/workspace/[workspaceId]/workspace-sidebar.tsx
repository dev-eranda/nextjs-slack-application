import { useChannelId } from "@/app/hooks/use-channel-id";
import { useMemberId } from "@/app/hooks/use-member-id";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetMembers } from "@/features/members/api/use-get-members.";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import UserItem from "./user-item";
import { WorkspaceHeader } from "./workspace-header";
import WorkspaceSection from "./workspace-section";

export const WorkspaceSidebar = () => {
   const memnerId = useMemberId();
   const channelId = useChannelId();
   const workspaceId = useWorkspaceId();

   const [_open, setOpen] = useCreateChannelModal();

   const { data: member, isLoading: isMemberLoading } = useCurrentMember({ workspaceId });
   const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId });
   const { data: channels, isLoading: isChannelsLoading } = useGetChannels({ workspaceId });
   const { data: members, isLoading: isMembersLoading } = useGetMembers({ workspaceId });

   if (isMemberLoading || isWorkspaceLoading) {
      return (
         <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
            <Loader className="size-5 animate-spin text-white" />
         </div>
      );
   }

   if (!member || !workspace) {
      return (
         <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
            <AlertTriangle className="size-5 text-white" />
            <p className="text-sm text-white">Workspace not found</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col bg-[#5E2C5F] h-full">
         <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
         <div className="flex flex-col px-2 mt-3">
            <SidebarItem label="Threads" icon={MessageSquareText} id="threads" variant="default" />
            <SidebarItem label="Draft & Sent" icon={SendHorizonal} id="draft" variant="default" />
         </div>
         <WorkspaceSection
            label="Channels"
            hint="New channel"
            onNew={member.role === "admin" ? () => setOpen(true) : undefined}>
            {channels?.map((item) => (
               <SidebarItem
                  key={item._id}
                  label={item.name}
                  icon={HashIcon}
                  id={item._id}
                  variant={channelId === item._id ? "active" : "default"}
               />
            ))}
         </WorkspaceSection>
         <WorkspaceSection label="Direct Messages" hint="New Direct Messages" onNew={() => {}}>
            {members?.map((member) => (
               <UserItem
                  key={member._id}
                  id={member._id}
                  label={member.user.name}
                  image={member.user.image}
                  variant={member._id === memnerId ? "active" : "default"}
               />
            ))}
         </WorkspaceSection>
      </div>
   );
};
