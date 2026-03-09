"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This hook runs client-side.
    if (!isAuthenticated) {
      router.push("/login");
    }
    setLoading(false);
  }, [isAuthenticated, router]);

  if (loading) {
     return <div className="flex h-screen items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  // If user is authenticated, render children
  return <>{children}</>;
}
