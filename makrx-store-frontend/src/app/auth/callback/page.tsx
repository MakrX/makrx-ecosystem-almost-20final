"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleAuthCallback } from "@/lib/auth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setStatus("error");
        setMessage(errorDescription || "Authentication failed");
        return;
      }

      if (!code || !state) {
        setStatus("error");
        setMessage("Invalid authentication response");
        return;
      }

      try {
        const success = await handleAuthCallback(code, state);

        if (success) {
          setStatus("success");
          setMessage("Authentication successful! Redirecting...");

          // Get the pre-login URL or default to home
          const preLoginUrl =
            localStorage.getItem("makrx_pre_login_url") || "/";
          localStorage.removeItem("makrx_pre_login_url");

          // Redirect after a short delay
          setTimeout(() => {
            router.push(preLoginUrl);
          }, 1500);
        } else {
          setStatus("error");
          setMessage("Authentication failed. Please try again.");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage("An error occurred during authentication");
      }
    };

    processCallback();
  }, [searchParams, router]);

  const handleRetry = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === "processing" && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <h2 className="mt-6 text-xl font-medium text-gray-900">
                  Processing Authentication
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="rounded-full h-12 w-12 bg-green-100 mx-auto flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 text-xl font-medium text-gray-900">
                  Authentication Successful
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="rounded-full h-12 w-12 bg-red-100 mx-auto flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 text-xl font-medium text-gray-900">
                  Authentication Failed
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Home
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
