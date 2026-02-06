/**
 * SlippageModal Component
 *
 * Modal for configuring slippage tolerance with preset buttons and custom input.
 */

"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";
import { useSwapStore } from "@/store/useSwapStore";
import { cn } from "@/lib/utils";

interface SlippageModalProps {
  open: boolean;
  onClose: () => void;
}

const PRESET_SLIPPAGES = [0.1, 0.5, 1.0];

export default function SlippageModal({ open, onClose }: SlippageModalProps) {
  const { slippage, setSlippage } = useSwapStore();
  const [tempSlippage, setTempSlippage] = useState(slippage.toString());
  const [isCustom, setIsCustom] = useState(false);

  // Sync temp slippage when modal opens or slippage changes
  useEffect(() => {
    if (open) {
      setTempSlippage(slippage.toString());
      setIsCustom(!PRESET_SLIPPAGES.includes(slippage));
    }
  }, [open, slippage]);

  const handlePresetClick = (value: number) => {
    setTempSlippage(value.toString());
    setIsCustom(false);
  };

  const handleCustomInput = (value: string) => {
    // Allow empty, numbers, and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTempSlippage(value);
      setIsCustom(true);
    }
  };

  const handleSave = () => {
    const numValue = parseFloat(tempSlippage);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      setSlippage(numValue);
      onClose();
    }
  };

  const currentValue = parseFloat(tempSlippage) || 0;
  const showWarning = currentValue > 5;
  const isValid = !isNaN(currentValue) && currentValue >= 0 && currentValue <= 50;

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#2C2C2C] dark:text-white">
          Slippage Tolerance
        </h2>
        <button
          onClick={onClose}
          className="text-[#666666] dark:text-[#999999] hover:text-[#2C2C2C] dark:hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-[#666666] dark:text-[#999999] mb-6">
        Your transaction will revert if the price changes unfavorably by more
        than this percentage.
      </p>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {PRESET_SLIPPAGES.map((value) => (
          <button
            key={value}
            onClick={() => handlePresetClick(value)}
            className={cn(
              "px-4 py-3 rounded-lg border-2 font-medium transition-all",
              !isCustom && currentValue === value
                ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                : "border-[#E0E0E0] dark:border-[#444444] text-[#2C2C2C] dark:text-white hover:border-[#CCCCCC] dark:hover:border-[#555555] hover:bg-[#F5F5F5] dark:hover:bg-[#333333]"
            )}
          >
            {value}%
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#666666] dark:text-[#999999] mb-2">
          Custom Slippage
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.50"
            value={tempSlippage}
            onChange={(e) => handleCustomInput(e.target.value)}
            className={cn(
              "w-full px-4 py-3 pr-12 rounded-lg border-2 font-medium transition-all",
              "bg-white dark:bg-[#333333] text-[#2C2C2C] dark:text-white",
              "placeholder:text-[#AAAAAA] dark:placeholder:text-[#666666]",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              isCustom
                ? "border-primary"
                : "border-[#E0E0E0] dark:border-[#444444]"
            )}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] dark:text-[#999999] font-medium">
            %
          </span>
        </div>
      </div>

      {/* Warning for high slippage */}
      {showWarning && (
        <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-yellow-800 dark:text-yellow-500 text-sm">
              High Slippage
            </div>
            <div className="text-yellow-700 dark:text-yellow-600 text-xs mt-1">
              You may receive significantly less than expected. Consider using a
              lower slippage tolerance.
            </div>
          </div>
        </div>
      )}

      {/* Invalid input warning */}
      {tempSlippage !== "" && !isValid && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-red-700 dark:text-red-400 text-sm">
            Please enter a valid slippage between 0% and 50%
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
          size="lg"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isValid || tempSlippage === ""}
          className="flex-1"
          size="lg"
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
