/**
 * App Providers
 *
 * Wraps the app with all necessary providers (Wagmi, Theme, etc.)
 */

"use client";

import { ReactNode } from "react";
import { WagmiProviderWrapper } from "@/lib/wagmi/provider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProviderWrapper>
      <ThemeProvider>{children}</ThemeProvider>
    </WagmiProviderWrapper>
  );
}
