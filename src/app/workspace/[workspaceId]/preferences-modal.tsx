import { TrashIcon } from "lucide-react";
import { useState } from "react";

import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";

import { useConfirm } from "@/app/hooks/use-confirm";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PreferencesModalProps {
   open: boolean;
   setOpen: (open: boolean) => void;
   initialValue: string;
}

export const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {
   const workspaceId = useWorkspaceId();
   const router = useRouter();

   const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This acction is irreversable");

   const [value, setValue] = useState(initialValue);
   const [editOpen, setEditOpen] = useState(false);

   const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
   const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

   const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      updateWorkspace(
         { id: workspaceId, name: value },
         {
            onSuccess: () => {
               setEditOpen(false);
               toast.success("workspace name updated");
            },
            onError: () => {
               toast.error("Faild to update workspace name");
            },
         }
      );
   };

   const handleRemove = async () => {
      const ok = await confirm();

      if (!ok) return;

      removeWorkspace(
         {
            id: workspaceId,
         },
         {
            onSuccess: () => {
               router.replace("/");
               toast.success("workspace removed");
            },
            onError: () => {
               toast.error("Faild to remove workspace");
            },
         }
      );
   };

   return (
      <>
         <ConfirmDialog />
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
               <DialogHeader className="p-4 border bg-white">
                  <DialogTitle>{value}</DialogTitle>
               </DialogHeader>
               <div className="px-4 pb-4 flex flex-col gap-y-2">
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                     <DialogTrigger>
                        <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                           <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold">Workspace name</p>
                              <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                           </div>
                           <p className="text-sm flex items-start">{value}</p>
                        </div>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Rename this workspace</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={handleEdit}>
                           <Input
                              value={value}
                              disabled={isUpdatingWorkspace}
                              onChange={(e) => setValue(e.target.value)}
                              required
                              autoFocus
                              minLength={3}
                              maxLength={80}
                              placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                           />

                           <DialogFooter>
                              <DialogClose asChild>
                                 <Button variant="outline" disabled={isUpdatingWorkspace}>
                                    Cancel
                                 </Button>
                              </DialogClose>
                              <Button type="submit" disabled={isUpdatingWorkspace}>
                                 Save
                              </Button>
                           </DialogFooter>
                        </form>
                     </DialogContent>
                  </Dialog>
                  <button
                     disabled={isRemovingWorkspace}
                     onClick={handleRemove}
                     className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 text-rose-600">
                     <TrashIcon className="size-4" />
                     <p className="text-sm font-semibold">Delete Wokspace</p>
                  </button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
};
