export const getApiUrl = () => {
    // 1. On the server (Server Component / Node.js SSR inside container or host)
    if (typeof window === 'undefined') {
        return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085";
    }

    // 2. On the client (Browser / Client Component)
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085";
};

export const getClientApiUrl = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:8085`;
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085";
};

export const getWsUrl = () => {
    if (process.env.NEXT_PUBLIC_WS_URL) {
        return process.env.NEXT_PUBLIC_WS_URL;
    }
    return getApiUrl();
};

