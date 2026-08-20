"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getApiUrl } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { setToken } from "@/lib/auth";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/components/ui/use-toast";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t, dir } = useTranslation();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1. Better Auth Sign Up with email & password
            const { data, error: signUpError } = await authClient.signUp.email({
                email,
                password,
                name: name || email.split("@")[0],
            });

            if (!signUpError && data?.token) {
                setToken(data.token);
                console.log("Better Auth sign-up successful. Token:", data.token);
                toast({
                    title: t("regSuccess"),
                    description: t("regSuccessDesc"),
                    variant: "success",
                });
                router.push("/");
                router.refresh();
                return;
            }

            // 2. Fallback to API Gateway auth register
            const res = await fetch(`${getApiUrl()}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, name }),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.message || signUpError?.message || "Registration failed");
            }

            toast({
                title: t("regSuccess"),
                description: t("regSuccessDesc"),
                variant: "success",
            });
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.message);
            toast({
                title: t("regFailed"),
                description: err.message || "Failed to register",
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
                    <CardTitle className="text-3xl font-extrabold tracking-tight">{t("registerTitle")}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {t("registerDesc")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                                {t("nameLabel")}
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">
                                {t("emailLabel")}
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
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
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold" disabled={loading}>
                            {loading ? t("signingUp") : t("signUp")}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                        {t("haveAccount")}{" "}
                        <Link href="/auth/login" className="underline underline-offset-4 hover:text-emerald-500 font-bold transition-all">
                            {t("loginHere")}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
