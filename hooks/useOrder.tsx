import { useState, useEffect } from 'react';
import { message } from 'antd';
import apiClient from '@/utils/apiClient';
import type { Order } from '@/types/order';

export const useOrder = (orderId: number) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/orders/${orderId}`);
            setOrder(response.data);
        } catch (err) {
            setError('Failed to load order');
            message.error('Failed to load order');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!orderId) return;


        fetchOrder();
    }, [orderId]);

    return { order, loading, error };
};
