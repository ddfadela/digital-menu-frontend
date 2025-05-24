'use client'
import MenuManager from '@/components/menu/MenuManager';
import RestaurantSelector from '@/components/menu/RestaurantSelector';
import React, { useState } from 'react';

const MenuDashboardClient = () => {
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

    return selectedRestaurant ? (
        <MenuManager restaurant={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} />
    ) : (
        <RestaurantSelector onSelect={setSelectedRestaurant} />
    );
};

export default MenuDashboardClient;