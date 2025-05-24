import { useState, useEffect } from 'react';
import { message, notification } from 'antd';
import apiClient from '@/utils/apiClient';
import { Order, OrderRequest, OrderStatus } from '@/types/order';

export const usePendingOrders = () => {
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);
    const [loadingPendingOrders, setLoadingPendingOrders] = useState(false);


    const fetchPendingOrders = async () => {
        setLoadingPendingOrders(true);
        try {
            const response = await apiClient.get(`/orders/status/${OrderStatus.PENDING}`);
            setPendingOrders(response.data);
        } catch (error) {
            message.error('Failed to fetch pending orders');
            console.error('Fetch error:', error);
        } finally {
            setLoadingPendingOrders(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    return {
        pendingOrders,
        loadingPendingOrders,
        fetchPendingOrders
    };
};
