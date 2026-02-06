/**
 * SettingsButton Component
 *
 * Gear icon button that displays current slippage and opens settings modal.
 */

"use client";

import { Settings } from "lucide-react";
import { useSwapStore } from "@/store/useSwapStore";
import { cn } from "@/lib/utils";

interface SettingsButtonProps {
  onClick: () => void;
}

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  const { slippage } = useSwapStore();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-lg transition-colors",
        "bg-white dark:bg-[#333333] border border-[#E0E0E0] dark:border-[#444444]",
        "hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] hover:border-[#CCCCCC] dark:hover:border-[#555555]",
        "shadow-sm"
      )}
      aria-label="Swap settings"
    >
      <Settings className="w-5 h-5 text-[#666666] dark:text-white" />

      {/* Slippage Badge */}
      <span
        className={cn(
          "absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full",
          "bg-primary text-white text-[10px] font-medium leading-none",
          "shadow-sm"
        )}
      >
        {slippage}%
      </span>
    </button>
  );
}
