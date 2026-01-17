// API Configuration
const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
    baseURL: isDevelopment
        ? 'http://localhost:4000'
        : (import.meta.env.VITE_API_URL || 'http://localhost:4000'),
    endpoints: {
        products: '/api/products',
        productById: (id: string) => `/api/products/${id}`,
        productsByOwner: (address: string) => `/api/products/owner/${address}`,
        syncProduct: (id: string) => `/api/products/sync/${id}`,
        health: '/health'
    }
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.baseURL}${endpoint}`;
};

// API client with error handling
export const apiClient = {
    async get(endpoint: string) {
        const response = await fetch(buildApiUrl(endpoint));
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },

    async post(endpoint: string, data?: any) {
        const response = await fetch(buildApiUrl(endpoint), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    }
};
