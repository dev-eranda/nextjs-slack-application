import { useQueryState } from "nuqs";

export const useParentMessageId = () => {
   return useQueryState("parentMessageId");
};

// add Nuqsadapter to main.tsx or index.tsx => <NuqsAdapter>{children}</NuqsAdapter>

// example
// http:localhost:3000?parentMessageId=12
