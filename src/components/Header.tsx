"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { logout, isAuthenticated } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LogIn, ShoppingCart, Shield, Home as HomeIcon, Warehouse, DollarSign, Sun, Moon, Globe } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleTheme, toggleLanguage } from "@/store/slices/uiSlice";
import { useTranslation } from "@/lib/translations";

export function Header() {
    const [isAuth, setIsAuth] = useState(false);
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { t, language, theme } = useTranslation();

    useEffect(() => {
        setIsAuth(isAuthenticated());
    }, []);

    const navLinks = [
        { href: "/", label: t("navHome"), icon: HomeIcon },
        { href: "/admin/permissions", label: t("navPermissions"), icon: Shield, badge: t("newBadge") },
        { href: "/admin/logistics", label: t("navLogistics"), icon: Warehouse },
        { href: "/admin/finance", label: t("navFinance"), icon: DollarSign },
    ];

    return (
        <header className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-4 md:px-6 shadow-2xl space-y-4 md:space-y-0 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Brand & Title */}
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <div className="flex items-center gap-3.5 group cursor-pointer">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                MS
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                                    {t("brandName")}
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                                        Pro
                                    </span>
                                </h1>
                                <p className="text-xs text-muted-foreground max-w-xs md:max-w-none">
                                    {t("brandDesc")}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex items-center gap-1 bg-background/60 p-1.5 rounded-2xl border border-border/60">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link key={link.href} href={link.href}>
                                <button
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                        isActive
                                            ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{link.label}</span>
                                    {link.badge && (
                                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? "bg-black/20 text-black" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"}`}>
                                            {link.badge}
                                        </span>
                                    )}
                                </button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions (Cart, Switchers & Auth) */}
                <div className="flex items-center gap-2.5">
                    {/* Cart */}
                    <Button variant="outline" className="bg-background border-border text-foreground hover:bg-accent text-xs rounded-xl">
                        <ShoppingCart className="mr-2 h-4 w-4 text-emerald-500" /> {t("cart")} (0)
                    </Button>

                    {/* Language Switcher */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => dispatch(toggleLanguage())}
                        className="bg-background border-border text-foreground hover:bg-accent rounded-xl"
                        title={language === "ar" ? "English" : "العربية"}
                    >
                        <span className="text-xs font-black font-mono">
                            {language === "ar" ? "EN" : "AR"}
                        </span>
                    </Button>

                    {/* Theme Switcher */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => dispatch(toggleTheme())}
                        className="bg-background border-border text-foreground hover:bg-accent rounded-xl"
                        title={theme === "dark" ? "Light Mode" : "Dark Mode"}
                    >
                        {theme === "dark" ? (
                            <Sun className="h-4 w-4 text-amber-500" />
                        ) : (
                            <Moon className="h-4 w-4 text-indigo-500" />
                        )}
                    </Button>

                    {/* Auth Button */}
                    {isAuth ? (
                        <Button variant="outline" onClick={logout} className="bg-background border-border text-rose-500 hover:bg-rose-500/10 hover:border-rose-300 text-xs rounded-xl">
                            <LogOut className="mr-2 h-4 w-4" /> {t("logout")}
                        </Button>
                    ) : (
                        <Link href="/auth/login">
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20">
                                <LogIn className="mr-2 h-4 w-4" /> {t("login")}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

