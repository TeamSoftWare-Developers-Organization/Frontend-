import { getApiUrl } from "@/lib/config";
import { Product } from "@/types";
import { Header } from "@/components/Header";
import { HomeClient } from "@/components/HomeClient";

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = typeof window === 'undefined'
      ? (process.env.INTERNAL_API_URL || 'http://nginx-proxy:80')
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085');

    const url = baseUrl.endsWith('/api') ? `${baseUrl}/products` : `${baseUrl}/api/products`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Failed to fetch products from ${url}: status ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Connection error:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen p-8 md:p-24 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        <Header />
        <HomeClient initialProducts={products} />
      </div>
    </main>
  );
}
