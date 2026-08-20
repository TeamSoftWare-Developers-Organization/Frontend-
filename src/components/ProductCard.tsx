"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { getToken, isAuthenticated, getUserRole } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getApiUrl, getClientApiUrl } from "@/lib/config";
import { useToast } from "@/components/ui/use-toast";
import { EditProductModal } from "./EditProductModal";
import { useTranslation } from "@/lib/translations";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setIsAdmin(getUserRole() === 'admin');
    }, []);

    const handleBuy = async () => {
        if (!isAuthenticated()) {
            router.push("/auth/login");
            return;
        }

        setLoading(true);
        try {
            const token = getToken();
            const res = await fetch(`${getApiUrl()}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: 1
                })
            });

            if (res.status === 401) {
                router.push("/auth/login");
                return;
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create order");
            }

            toast({
                title: t("orderPlaced"),
                description: t("orderPlacedDesc", { name: product.name_ar }),
                variant: "success",
            });
            router.refresh();
        } catch (error: any) {
            toast({
                title: t("orderFailed"),
                description: error.message || "Failed to place order",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Resolve URL for display
    const displayImageUrl = product.main_image_url
        ? product.main_image_url.startsWith("/")
            ? `${getClientApiUrl()}${product.main_image_url}`
            : product.main_image_url
        : "";

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 bg-card/60 backdrop-blur-sm">
            {displayImageUrl ? (
                <div className="relative w-full h-48 overflow-hidden group">
                    <img 
                        src={displayImageUrl} 
                        alt={product.name_ar} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/30 flex items-center justify-center border-b border-border/30">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground/40" />
                </div>
            )}
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span>{product.name_ar}</span>
                    <span className="text-xl font-bold text-primary">{Number(product.price_lyd).toLocaleString()} LYD</span>
                </CardTitle>
                <CardDescription>{product.description_ar}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t("stock")}: <span className={product.stock_quantity > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                        {product.stock_quantity > 0 ? product.stock_quantity : t("outOfStock")}
                    </span></span>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button
                    className="flex-1"
                    disabled={product.stock_quantity <= 0 || loading}
                    onClick={handleBuy}
                >
                    {loading ? t("processing") : (
                        <>
                            <ShoppingCart className="mr-2 h-4 w-4" /> {t("buyNow")}
                        </>
                    )}
                </Button>
                {isAdmin && <EditProductModal product={product} />}
            </CardFooter>
        </Card>
    );
}
