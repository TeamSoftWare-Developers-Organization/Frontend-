"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/config";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { setToken } from "@/lib/auth";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t, dir } = useTranslation();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Try Better Auth sign in first
            const { data, error: authError } = await authClient.signIn.email({
                email,
                password,
            });

            if (!authError && data?.token) {
                setToken(data.token);
                console.log("Better Auth sign-in successful. Token:", data.token);
                toast({
                    title: t("authSuccess"),
                    description: t("authSuccessDesc"),
                    variant: "success",
                });
                router.push("/");
                router.refresh();
                return;
            }

            // 2. Fallback to Microservices API Gateway Auth
            const res = await fetch(`${getApiUrl()}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.message || authError?.message || "Login failed");
            }

            setToken(responseData.accessToken);
            toast({
                title: t("authSuccess"),
                description: t("authSuccessDesc"),
                variant: "success",
            });
            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            toast({
                title: t("authFailed"),
                description: err.message || "Failed to place order",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4" dir={dir}>
            <Card className="w-full max-w-md shadow-2xl border-border bg-card text-foreground">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-extrabold tracking-tight">{t("loginTitle")}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {t("loginDesc")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                                {t("emailLabel")}
                            </label>
                            <input
                                type="email"
                                placeholder="admin@admin.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                                {t("passwordLabel")}
                            </label>
                            <input
                                type="password"
                                placeholder="admin123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold" disabled={loading}>
                            {loading ? t("signingIn") : t("signIn")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                        {t("noAccount")}{" "}
                        <Link href="/auth/register" className="underline underline-offset-4 hover:text-emerald-500 font-bold transition-all">
                            {t("registerNow")}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
