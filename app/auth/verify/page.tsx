"use client";

import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const hasVerifiedRef = useRef(false);

  // Extract token once and memoize to avoid unnecessary effect runs
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  useEffect(() => {
    // Prevent multiple calls
    if (hasVerifiedRef.current) {
      return;
    }

    if (!token) {
      setError("Invalid verification link");
      return;
    }

    const verifyToken = async () => {
      // Mark as verifying to prevent concurrent calls - set BEFORE async operation
      hasVerifiedRef.current = true;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          await login(data.token);
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in",
          });
          router.push("/dashboard");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Invalid or expired verification link");
          // Reset ref on error to allow retry if needed
          hasVerifiedRef.current = false;
        }
      } catch (error) {
        console.error("[v0] Verification error:", error);
        setError("An unexpected error occurred");
        // Reset ref on error to allow retry if needed
        hasVerifiedRef.current = false;
      }
    };

    verifyToken();
  }, [token, login, router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">FormGuard</h1>

        {error ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mt-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verification failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/login"
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Back to login
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mt-8">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            </div>
            <p className="text-gray-600">Verifying your account...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
