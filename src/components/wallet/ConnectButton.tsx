"use client";

/**
 * ConnectButton Component
 *
 * Wallet connection button using RainbowKit with custom SODAX styling
 * - "Connect Wallet" button (disconnected state)
 * - Address button with balance (connected state)
 */

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, ChevronDown } from "lucide-react";

/**
 * Truncates an Ethereum address to show first 6 and last 4 characters
 */
function truncateAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Ensure component is mounted before rendering
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                // Disconnected state - show "Connect Wallet" button
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white dark:text-[#1A1A1A] rounded-lg
                             hover:bg-primary-700 transition-all font-medium text-sm shadow-sm
                             active:scale-95"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              // Handle unsupported chain
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg
                             hover:bg-red-700 transition-all font-medium text-sm shadow-sm
                             active:scale-95"
                  >
                    <span>Wrong Network</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                );
              }

              // Connected state - show address and balance
              return (
                <div className="flex items-center gap-2">
                  {/* Chain selector button */}
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#2C2C2C] border border-[#E0E0E0] dark:border-[#444444]
                             text-text-primary dark:text-white rounded-lg
                             hover:bg-[#F5F5F5] dark:hover:bg-[#333333] transition-all font-medium text-sm shadow-sm
                             active:scale-95"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Account button */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white dark:text-[#1A1A1A] rounded-lg
                             hover:bg-primary-700 transition-all font-medium text-sm shadow-sm
                             active:scale-95"
                  >
                    <span>{truncateAddress(account.address)}</span>
                    {account.displayBalance && (
                      <span className="text-white/80 dark:text-[#1A1A1A]/80">
                        ({account.displayBalance})
                      </span>
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
