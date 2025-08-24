import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Timeline } from '../components/Timeline';

const API_URL = "http://localhost:4000";

interface ProductHistory {
    id: number;
    name: string;
    owner: string;
    history: any[];
}

const ConsumerVerification: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<ProductHistory | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProductHistory = useCallback(async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/products/${productId}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error("Failed to fetch product history:", error);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductHistory();
    }, [fetchProductHistory]);

    if (loading) return <div className="text-center p-10">Loading product history...</div>;
    if (!product) return <div className="text-center p-10">Product not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Journey</h1>
            <p className="text-lg text-gray-600 mb-6">Tracking: <span className="font-semibold">{product.name} (ID: {product.id})</span></p>
            <Timeline history={product.history} />
        </div>
    );
};

export default ConsumerVerification;