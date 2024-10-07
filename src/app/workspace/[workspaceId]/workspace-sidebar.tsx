import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { AlertTriangle, Loader, MessageSquareText, SendHorizonal } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceHeader } from "./workspace-header";

export const WorkspaceSidebar = () => {
   const workspaceId = useWorkspaceId();

   const { data: member, isLoading: memberLoading } = useCurrentMember({
      workspaceId,
   });
   const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
      id: workspaceId,
   });

   if (memberLoading || workspaceLoading) {
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
      </div>
   );
};
