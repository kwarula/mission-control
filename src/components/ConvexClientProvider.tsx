"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    return new ConvexReactClient(url);
  }, []);

  if (!convex) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f12] text-white">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto text-2xl">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">Mission Control</h1>
          <p className="text-[#71717a] text-sm">
            Set <code className="text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_CONVEX_URL</code> to connect to your Convex backend.
          </p>
          <div className="glass-card p-4 text-left text-xs text-[#a1a1aa] space-y-2">
            <p>1. Run <code className="text-brand-400">npx convex dev</code> to start your Convex backend</p>
            <p>2. Copy the deployment URL from the Convex dashboard</p>
            <p>3. Add it to <code className="text-brand-400">.env.local</code></p>
          </div>
        </div>
      </div>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
