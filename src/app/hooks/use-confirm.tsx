import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export const useConfirm = (title: string, message: string): [any, any] => {
   const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

   return ["", ""];
};
