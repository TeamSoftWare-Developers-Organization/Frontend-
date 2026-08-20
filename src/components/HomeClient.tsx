"use client";

import { useTranslation } from "@/lib/translations";
import { ProductCard } from "@/components/ProductCard";
import { AddProductModal } from "@/components/AddProductModal";
import { Product } from "@/types";

interface HomeClientProps {
  initialProducts: Product[];
}

export function HomeClient({ initialProducts }: HomeClientProps) {
  const { t, dir } = useTranslation();

  return (
    <div className="space-y-10" dir={dir}>
      <div className="flex justify-end">
        <AddProductModal />
      </div>

      {initialProducts.length === 0 ? (
        <div className="text-center py-25 bg-card/40 rounded-3xl border border-border/50 backdrop-blur-sm shadow-inner">
          <h2 className="text-2xl font-bold mb-2 text-foreground">{t("noProducts")}</h2>
          <p className="text-muted-foreground text-sm">{t("storeOffline")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {initialProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
