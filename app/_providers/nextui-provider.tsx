"use client";

import { useRouter } from "next/navigation";
import { NextUIProvider as Provider } from "@nextui-org/system";

// Only if using TypeScript
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function NextUIProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return <Provider navigate={router.push}>{children}</Provider>;
}
