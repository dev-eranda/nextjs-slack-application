"use client";

import { Provider } from "jotai";

interface JotaiProviderPros {
  children: React.ReactNode;
}

export const JotaiProvider = ({ children }: JotaiProviderPros) => {
  return <Provider>{children}</Provider>;
};
