"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple verification calls
    if (hasProcessedRef.current) {
      return;
    }

    const handlePaymentCallback = async () => {
      const success = searchParams.get("success");
      const canceled = searchParams.get("canceled");
      const sessionId = searchParams.get("session_id");

      // Handle canceled checkout
      if (canceled === "true") {
        hasProcessedRef.current = true;
        setStatus("error");
        setMessage(
          "Checkout was canceled. No changes were made to your subscription."
        );

        toast({
          title: "Checkout canceled",
          description: "Your subscription was not changed.",
        });

        // Clean up URL and redirect
        window.history.replaceState({}, "", "/settings/billing");
        setTimeout(() => {
          router.push("/settings?tab=billing");
        }, 2000);
        return;
      }

      // Handle successful checkout
      if (success === "true" && sessionId) {
        hasProcessedRef.current = true;

        try {
          // Verify the session with the backend
          const verifyResponse = await api.billing.verifySession(sessionId);

          if (verifyResponse?.success && verifyResponse?.session) {
            setStatus("success");
            setMessage("Your subscription has been successfully updated!");

            toast({
              title: "Payment successful!",
              description: "Your plan has been upgraded successfully.",
            });

            // Clean up URL
            window.history.replaceState({}, "", "/settings/billing");

            // Redirect after a short delay to show success message
            setTimeout(() => {
              router.push("/settings?tab=billing");
            }, 3000);
          } else {
            throw new Error("Failed to verify payment session");
          }
        } catch (error: any) {
          console.error("[v0] Failed to verify payment:", error);
          setStatus("error");
          setMessage(
            error.message ||
              "Failed to verify payment. Please contact support if the payment was processed."
          );

          toast({
            variant: "destructive",
            title: "Verification failed",
            description:
              "We couldn't verify your payment. Please check your subscription status.",
          });
        }
        return;
      }

      // If no success or canceled params, just show error
      // This handles direct navigation to the page
      hasProcessedRef.current = true;
      setStatus("error");
      setMessage("Invalid payment session. Please try again.");
    };

    handlePaymentCallback();
  }, [searchParams, router, toast]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {status === "loading" && (
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                )}
                {status === "success" && (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                )}
                {status === "error" && (
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">
                {status === "loading" && "Processing Payment..."}
                {status === "success" && "Payment Successful!"}
                {status === "error" && "Payment Verification Failed"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">{message}</p>

              {status === "loading" && (
                <p className="text-sm text-gray-500">
                  Please wait while we verify your payment...
                </p>
              )}

              {status === "success" && (
                <>
                  <p className="text-sm text-gray-500">
                    You will be redirected to your billing settings shortly.
                  </p>
                  <div className="pt-4">
                    <Button
                      onClick={() => router.push("/settings?tab=billing")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Go to Billing Settings
                    </Button>
                  </div>
                </>
              )}

              {status === "error" && (
                <>
                  <p className="text-sm text-gray-500">
                    If you completed the payment, your subscription may still be
                    processing. Please check your billing settings or contact
                    support.
                  </p>
                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={() => router.push("/settings?tab=billing")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Check Billing Status
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                      className="w-full"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense
      fallback={
        <ProtectedRoute>
          <DashboardLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      }
    >
      <BillingSuccessContent />
    </Suspense>
  );
}
