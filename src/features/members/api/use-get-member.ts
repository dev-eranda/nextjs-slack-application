import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface usegetMemberProps {
   id: Id<"members">;
}

export const useGetMember = ({ id }: usegetMemberProps) => {
   const data = useQuery(api.members.getById, { id });
   const isLoading = data === undefined;

   return { data, isLoading };
};
