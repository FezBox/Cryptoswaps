import SwapCard from "@/components/swap/SwapCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Swap Tokens
        </h1>
        <p className="text-text-secondary">
          Cross-chain swaps across 15+ blockchain networks
        </p>
      </div>

      {/* Swap Card */}
      <SwapCard />
    </div>
  );
}
