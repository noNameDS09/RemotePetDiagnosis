'use client';

import type { FormEvent } from 'react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, LogIn, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Switch } from '@/components/ui/switch';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isDoctor }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user?.email || data.doctor?.email || 'user'}!`,
        });
        router.push('/');
        router.refresh();
      } else {
        toast({
          title: "Login Failed",
          description: data.message || 'An error occurred during login.',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login request failed:', error);
      toast({
        title: "Login Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-5.1rem)] bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <PawPrint className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">PetConnect Login</CardTitle>
          <CardDescription>Access your pet monitoring dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isDoctor" className="flex items-center gap-2">
                <Switch
                  id="isDoctor"
                  checked={isDoctor}
                  onCheckedChange={setIsDoctor}
                  disabled={isLoading}
                />
                I'm a doctor
              </Label>
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm text-muted-foreground space-y-2">
          <p>Need an account?</p>
          <Button variant="link" asChild className="p-0 h-auto">
            <Link href="/signup">Create an account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
