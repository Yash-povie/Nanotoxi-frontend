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
  const { login, isAuthenticated } = useAuth();
  const router = useRouter(); // Use useRouter explicitly
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "admin",
      password: "password123"
    }
  }); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]); // Dependency array

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const getBackendUrl = () => {
        const hostname = window.location.hostname;
        return `http://${hostname}:8000/token`;
      };
      const res = await axios.post(getBackendUrl(), formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      login(res.data.access_token);
    } catch (err: any) {
       console.error("Login error:", err);
       if (axios.isAxiosError(err) && err.response) {
            setError(`Login failed: ${err.response.data.detail || err.message}`);
       } else {
            setError("Login failed. Check server connection logs.");
       }
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

