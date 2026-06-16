'use client';

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">ContentCommand AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => signIn('github', { callbackUrl: '/dashboard' })} className="w-full">
            Sign in with GitHub
          </Button>
          <div className="relative border-t my-4">
            <span className="absolute -top-3 bg-white px-2 left-1/2 -translate-x-1/2 text-sm text-gray-500">or</span>
          </div>
          <Button onClick={() => signIn('credentials', { email: 'test@example.com', password: 'password', callbackUrl: '/dashboard' })} variant="outline" className="w-full">
            Demo Login (test@example.com)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
