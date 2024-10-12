import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useCerateChannel } from "../api/use-create-channel";
import { useCreateChannelModal } from "../store/use-create-channel-modal";

export const CreateChannelModal = () => {
   const router = useRouter();
   const workspaceId = useWorkspaceId();

   const [open, setOpen] = useCreateChannelModal();
   const [name, setName] = useState("");

   const { mutate, isPending } = useCerateChannel();

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      mutate(
         {
            name,
            workspaceId,
         },
         {
            onSuccess: (id) => {
               toast.error("Channel created successfully");
               router.push(`/workspace/${workspaceId}/channel/${id}`);
               handleClose();
            },

            onError: () => {
               toast.error("Failed to create channel");
            },
         }
      );
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
      setName(value);
   };

   const handleClose = () => {
      setName("");
      setOpen(false);
   };

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add a channel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
               <Input
                  value={name}
                  disabled={isPending}
                  onChange={handleChange}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={80}
                  placeholder="e.g. plan-budget"
               />
               <div className="flex justify-end">
                  <Button disabled={isPending}>Create</Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
};
