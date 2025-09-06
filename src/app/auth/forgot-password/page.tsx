'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tsunami-blue-50 via-white to-tsunami-green-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-4 text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">📧</span>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 bg-clip-text text-transparent">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-base">
                We&apos;ve sent a password reset link to your email address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  If an account with email <strong>{email}</strong> exists, you will receive a password reset link shortly.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full h-12 text-base bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 hover:from-tsunami-blue-700 hover:to-tsunami-green-700 transition-all duration-200"
                >
                  Back to Sign In
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn&apos;t receive the email?{' '}
                    <button
                      onClick={() => setSuccess(false)}
                      className="font-medium text-tsunami-blue-600 hover:text-tsunami-blue-700 transition-colors"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tsunami-blue-50 via-white to-tsunami-green-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">🔑</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-base">
              Enter your email address and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 hover:from-tsunami-blue-700 hover:to-tsunami-green-700 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm font-medium text-tsunami-blue-600 hover:text-tsunami-blue-700 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
