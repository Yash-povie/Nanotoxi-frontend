"use client";

import { useAuth } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter(); 
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  }); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]); 

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, we are redirecting, so return null or spinner
  if (isAuthenticated) return null;

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      const validUsers: Record<string, { name: string; designation: string }> = {
        "Rishith": { name: "Rishith", designation: "Intern" },
        "Roshni": { name: "Roshni", designation: "Intern" },
        "Yash": { name: "Yash", designation: "Tech Lead" },
        "Ronith": { name: "Ronith", designation: "Tech Lead" },
        "Smita": { name: "Smita", designation: "Owner" }
      };

      if (validUsers[data.username] && data.password === "password123") {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        login("mock-jwt-token-for-frontend-access", {
          username: data.username,
          name: validUsers[data.username].name,
          designation: validUsers[data.username].designation
        });
      } else {
        setError("Invalid credentials. Please use one of the authorized accounts.");
      }
    } catch (err: any) {
       console.error("Login error:", err);
       setError("Login failed. Please try again.");
    }
  };

  if (isAuthenticated) return <div className="text-center">Redirecting...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm rounded-xl border-border shadow-2xl bg-card">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl text-primary font-bold">Pulse Engine</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Input 
                    {...register("username")} 
                    placeholder="Username" 
                    className="bg-muted/50 border-border focus:border-primary"
                />
            </div>
            <div className="space-y-2">
                <Input 
                    {...register("password")} 
                    type="password" 
                    placeholder="Password" 
                    className="bg-muted/50 border-border focus:border-primary"
                />
            </div>
            {error && <p className="text-destructive text-xs text-center font-medium">{error}</p>}
            <Button type="submit" className="w-full font-semibold">
              Sign In
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Default: admin / password123
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

