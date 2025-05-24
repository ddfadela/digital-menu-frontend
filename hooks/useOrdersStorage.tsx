import { Restaurant } from '@/types/restaurant';
import apiClient from '@/utils/apiClient';
import { useState, useEffect } from 'react';

interface Order {
    id: number;
    restaurantId: number;
    restaurant: Restaurant;
    totalPrice: number;
    status: string;
    createdAt: string;
}

export const useOrdersStorage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get order IDs from localStorage
            const existingOrders = localStorage.getItem('userOrders');
            if (!existingOrders) {
                setOrders([]);
                return;
            }

            const orderIds: number[] = JSON.parse(existingOrders);
            if (!Array.isArray(orderIds) || orderIds.length === 0) {
                setOrders([]);
                return;
            }

            const orderPromises = orderIds.map(async (orderId) => {
                try {
                    const response = await apiClient.get(`/orders/${orderId}`);
                    return response.data;
                } catch (error) {
                    console.warn(`Failed to fetch order ${orderId}:`, error);
                    return null;
                }
            });

            const fetchedOrders = await Promise.all(orderPromises);

            const validOrders = fetchedOrders
                .filter(order => order !== null)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setOrders(validOrders);

            // Clean up localStorage to remove IDs of orders that no longer exist
            const validOrderIds = validOrders.map(order => order.id);
            if (validOrderIds.length !== orderIds.length) {
                localStorage.setItem('userOrders', JSON.stringify(validOrderIds));
            }

        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getVotableOrders = () => {
        return orders
    };

    const addOrder = (orderId: number) => {
        try {
            const existingOrders = localStorage.getItem('userOrders');
            let ordersList: number[] = [];

            if (existingOrders) {
                try {
                    const parsed = JSON.parse(existingOrders);
                    if (Array.isArray(parsed)) {
                        ordersList = parsed.filter(id => typeof id === 'number' && !isNaN(id));
                    }
                } catch (parseError) {
                    console.warn('Failed to parse existing orders:', parseError);
                }
            }

            ordersList.unshift(orderId);

            ordersList = ordersList.slice(0, 20);

            ordersList = [...new Set(ordersList)];
            localStorage.setItem('userOrders', JSON.stringify(ordersList));

            fetchOrders();

        } catch (error) {
            console.error('Failed to add order ID to localStorage:', error);
        }
    };

    const removeOrderId = (orderId: number) => {
        try {
            const existingOrders = localStorage.getItem('userOrders');
            if (!existingOrders) return;

            const ordersList: number[] = JSON.parse(existingOrders);
            const updatedList = ordersList.filter(id => id !== orderId);

            localStorage.setItem('userOrders', JSON.stringify(updatedList));

            fetchOrders();

        } catch (error) {
            console.error('Failed to remove order ID from localStorage:', error);
        }
    };

    const clearOrders = () => {
        try {
            localStorage.removeItem('userOrders');
            setOrders([]);
        } catch (error) {
            console.error('Failed to clear orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return {
        orders,
        loading,
        error,
        getVotableOrders,
        addOrder,
        removeOrderId,
        clearOrders,
        refreshOrders: fetchOrders
    };
};