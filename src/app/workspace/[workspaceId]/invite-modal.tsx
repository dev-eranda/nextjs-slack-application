import { useConfirm } from "@/app/hooks/use-confirm";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModalProps {
   open: boolean;
   setOpen: (open: boolean) => void;
   name: string;
   joingCode: string;
}

export const InviteModal = ({ open, setOpen, name, joingCode }: InviteModalProps) => {
   const workspaceId = useWorkspaceId();
   const [ConfirmDialog, confirm] = useConfirm(
      "Are you sure?",
      "This will deactivate the current invite code and generate a new one"
   );

   const { mutate, isPending } = useNewJoinCode();

   const handleNewCode = async () => {
      const ok = await confirm();

      if (!ok) return;

      mutate(
         {
            workspaceId,
         },
         {
            onSuccess: () => {
               toast.success("Invite code regenerated");
            },
            onError: () => {
               toast.error("Faild to regenerate invite code");
            },
         }
      );
   };

   const handleCopy = () => {
      const inviteLink = `${window.location.origin}/join/${workspaceId}`;

      window.navigator.clipboard.writeText(inviteLink).then(() => toast.success("Invite link copied to clipboard"));
   };

   return (
      <>
         <ConfirmDialog />
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
               <DialogHeader className="flex flex-col items-start">
                  <DialogTitle>Invite people to your {name}</DialogTitle>
                  <DialogDescription>Use the code below to invite people to your worksapce</DialogDescription>
               </DialogHeader>
               <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                  <p className="text-4xl font-bold tracking-widest uppercase">{joingCode}</p>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                     Copy link
                     <CopyIcon className="size-4 ml-2" />
                  </Button>
               </div>
               <div className="flex items-center justify-between w-full">
                  <Button onClick={handleNewCode} disabled={isPending} variant="outline">
                     New Code
                     <RefreshCcw className="size-4 ml-2" />
                  </Button>
                  <DialogClose asChild>
                     <Button>Close</Button>
                  </DialogClose>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
};
