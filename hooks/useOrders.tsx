import { useState, useEffect } from 'react';
import { message, notification } from 'antd';
import apiClient from '@/utils/apiClient';
import { Order, OrderRequest, OrderStatus } from '@/types/order';

export const useOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState<boolean>(false);


    const submitOrder = async (orderData: OrderRequest): Promise<Order | null> => {
        setSubmitting(true);

        try {

            const response = await apiClient.post('/orders', orderData);
            const order: Order = response.data;

            // Save order ID to localStorage for later retrieval
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

                ordersList.unshift(order.id);
                ordersList = ordersList.slice(0, 20);
                ordersList = [...new Set(ordersList)];
                localStorage.setItem('userOrders', JSON.stringify(ordersList));

            } catch (storageError) {
                console.warn('Failed to save order ID to localStorage:', storageError);
            }


            return order;

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Erreur lors de l'envoi de la commande";
            message.error(errorMessage);
            console.error("Order submit error:", err);
            return null;
        } finally {
            setSubmitting(false);
        }
    };


    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/orders');
            setOrders(response.data);
        } catch (error) {
            message.error('Failed to fetch orders');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };



    const updateOrderStatus = async (id: number, values: Partial<any>) => {
        try {
            const cleanedValues = cleanFormValues(values);
            console.log('cleanedValues', cleanedValues)
            await apiClient.patch(`/orders/${id}/status/`, cleanedValues);
            message.success('Order updated successfully');
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update order';
            message.error(errorMessage);
            console.error('Update error:', error);
            return false;
        }
    };

    const toggleOrderStatus = async (id: number, currentStatus: boolean) => {
        try {
            const order = orders.find(o => o.id === id);
            if (!order) {
                message.error('Order not found');
                return false;
            }

            const updatedData = {
                ...order,
                isActive: !currentStatus,
            };

            await apiClient.put(`/orders/${id}`, updatedData);
            message.success(`Order ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            await fetchOrders();
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update order status';
            message.error(errorMessage);
            console.error('Status toggle error:', error);
            return false;
        }
    };

    const cleanFormValues = (values: any) => {
        const cleaned = { ...values };
        Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === '' || cleaned[key] === undefined) {
                cleaned[key] = null;
            }
            if (typeof cleaned[key] === 'string') {
                cleaned[key] = cleaned[key].trim();
            }
        });
        return cleaned;
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return {
        orders,
        loading,
        fetchOrders,
        updateOrderStatus,
        toggleOrderStatus,
        submitOrder,
        submitting,
    };
};
