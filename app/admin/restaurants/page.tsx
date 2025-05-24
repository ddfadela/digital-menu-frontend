'use client'
import { useState } from 'react';
import { Button } from 'antd';
import RestaurantTable from '@/components/restaurants/RestaurantTable';
import RestaurantModal from '@/components/restaurants/RestaurantModal';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Restaurant } from '@/types/restaurant';


const Page = () => {
    const {
        restaurants,
        loading,
        createRestaurant,
        updateRestaurant,
        deleteRestaurant,
        toggleRestaurantStatus,
    } = useRestaurants();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

    const handleAdd = () => {
        setEditingRestaurant(null);
        setIsModalOpen(true);
    };

    const handleEdit = (restaurant: Restaurant) => {
        setEditingRestaurant(restaurant);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        await deleteRestaurant(id);
    };

    const handleFormSubmit = async (values: any) => {
        let success = false;

        if (editingRestaurant) {
            success = await updateRestaurant(editingRestaurant.id, values);
        } else {
            success = await createRestaurant(values);
        }

        if (success) {
            setIsModalOpen(false);
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        await toggleRestaurantStatus(id, currentStatus);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Restaurants Management</h1>
                <Button type="primary" onClick={handleAdd} size="large">
                    Add New Restaurant
                </Button>
            </div>

            <RestaurantTable
                restaurants={restaurants}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />

            <RestaurantModal
                open={isModalOpen}
                editingRestaurant={editingRestaurant}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Page;