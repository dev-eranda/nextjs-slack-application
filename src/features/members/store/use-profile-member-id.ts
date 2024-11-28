import { useQueryState } from "nuqs";

export const useProfileMemberId = () => {
   return useQueryState("profileMemberId");
};

// add Nuqsadapter to main.tsx or index.tsx => <NuqsAdapter>{children}</NuqsAdapter>

// example
// http:localhost:3000?parentMessageId=12
