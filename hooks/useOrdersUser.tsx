import { useState, useEffect } from 'react';
import { message, notification } from 'antd';
import apiClient from '@/utils/apiClient';
import { Order, OrderRequest, OrderStatus } from '@/types/order';

export const useOrdersUser = () => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const submitOrder = async (orderData: OrderRequest): Promise<Order | null> => {
        setSubmitting(true);

        try {

            const response = await apiClient.post('/orders', orderData);
            const order: Order = response.data;
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
    }

    return {
        submitOrder,
        submitting,
    };
};
