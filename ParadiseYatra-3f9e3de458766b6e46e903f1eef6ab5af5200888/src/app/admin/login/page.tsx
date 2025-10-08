"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image"; 
import { Loader2 } from "lucide-react";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.user.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
    >
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
          <div className="space-y-1 pb-2 pt-8 px-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Image src="/footerLogo.png" alt="logo" className="w-20 h-20 object-contain" width={80} height={80} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Admin Portal
            </h2>
            <p className="text-center text-gray-800 text-sm font-medium">
              Enter your credentials to access the dashboard
            </p>
          </div>
          <CardContent className="pt-2 px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-900"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="h-12 bg-white text-gray-900 border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-base font-medium placeholder-gray-500"
                />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-900"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 text-gray-900 bg-white border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-base font-medium placeholder-gray-500"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 shadow-lg transition-all duration-200 text-white font-bold text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-700 text-sm font-medium">
            Not an admin?{" "}
            <a
              href="#"
              className="font-bold text-indigo-700 hover:text-indigo-800 underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;