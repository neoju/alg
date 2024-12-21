// app/providers.tsx
"use client";

import { useRouter } from "next/navigation";
import { NextUIProvider } from "@nextui-org/react";
import { Provider as JotaiProvider } from "jotai";

// Only if using TypeScript
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <JotaiProvider>{children}</JotaiProvider>
    </NextUIProvider>
  );
}
