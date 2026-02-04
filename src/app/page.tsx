import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-5xl font-bold text-text-primary">
          Welcome to <span className="text-primary">SODAX</span>
        </h1>
        <p className="text-xl text-text-secondary">
          The seamless cross-chain swap platform for cryptocurrency trading
          across 15+ blockchain networks.
        </p>
        <div className="pt-4">
          <div className="inline-block px-6 py-3 bg-accent text-white rounded-xl font-medium shadow-md">
            Phase 1: Foundation Complete
          </div>
        </div>
      </div>

      {/* Preview Card Area */}
      <div className="mt-12 w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Swap Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary text-sm">
              Swap components will be implemented in Phase 2
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
