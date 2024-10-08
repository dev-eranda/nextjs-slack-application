import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

const userItemVariants = cva("flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm oveflow-hidden", {
   variants: {
      variant: {
         default: "text-[#f9edffcc]",
         active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
   },
   defaultVariants: {
      variant: "default",
   },
});

interface UserItemProps {
   id: Id<"members">;
   label?: string;
   image?: string;
   variant?: VariantProps<typeof userItemVariants>["variant"];
}

const UserItem = ({ id, label = "Member", image, variant }: UserItemProps) => {
   const workspaceId = useWorkspaceId();
   const avatarFallback = label.charAt(0).toUpperCase();

   return (
      <div>
         <Button variant="transparent" className={cn(userItemVariants({ variant: variant }))} size="sm" asChild>
            <Link href={`/workspace/${workspaceId}/member/${id}`}>
               <Avatar className="size-5 mr-1">
                  <AvatarImage alt={image} src={image} />
                  <AvatarFallback className="text-gray-700">{avatarFallback}</AvatarFallback>
               </Avatar>
               <span className="text-sm truncate">{label}</span>
            </Link>
         </Button>
      </div>
   );
};

export default UserItem;
