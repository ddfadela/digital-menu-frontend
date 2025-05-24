import { useState, useEffect } from 'react';
import { message } from 'antd';
import apiClient from '@/utils/apiClient';
import { Restaurant } from '@/types/restaurant';

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/restaurants');
            setRestaurants(res.data);
        } catch (err) {
            message.error('Failed to fetch restaurants');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const createRestaurant = async (values: Partial<Restaurant>) => {
        try {
            const cleanValues = cleanFormValues(values);
            await apiClient.post('/restaurants', { ...cleanValues, isActive: true });
            message.success('Restaurant added successfully');
            await fetchRestaurants();
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create restaurant';
            message.error(errorMessage);
            console.error('Create error:', err);
            return false;
        }
    };

    const updateRestaurant = async (id: number, values: Partial<Restaurant>) => {
        try {
            const cleanValues = cleanFormValues(values);
            await apiClient.put(`/restaurants/${id}`, cleanValues);
            message.success('Restaurant updated successfully');
            await fetchRestaurants();
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update restaurant';
            message.error(errorMessage);
            console.error('Update error:', err);
            return false;
        }
    };

    const deleteRestaurant = async (id: number) => {
        try {
            await apiClient.delete(`/restaurants/${id}`);
            message.success('Restaurant deleted successfully');
            await fetchRestaurants();
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete restaurant';
            message.error(errorMessage);
            console.error('Delete error:', err);
            return false;
        }
    };

    const toggleRestaurantStatus = async (id: number, currentStatus: boolean) => {
        try {
            const restaurant = restaurants.find(r => r.id === id);
            if (!restaurant) {
                message.error('Restaurant not found');
                return false;
            }

            const updatedData = {
                ...restaurant,
                isActive: !currentStatus
            };

            await apiClient.put(`/restaurants/${id}`, updatedData);
            message.success(`Restaurant ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            await fetchRestaurants();
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update restaurant status';
            message.error(errorMessage);
            console.error('Status toggle error:', err);
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
        fetchRestaurants();
    }, []);

    return {
        restaurants,
        loading,
        fetchRestaurants,
        createRestaurant,
        updateRestaurant,
        deleteRestaurant,
        toggleRestaurantStatus,
    };
};