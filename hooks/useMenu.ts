import { Category } from "@/types/category";
import { MenuResponse } from "@/types/menu";
import { Restaurant } from "@/types/restaurant";
import apiClient from "@/utils/apiClient";
import { message } from "antd";
import React, { useState } from "react";

export const useMenu = (restaurantId: number) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    if (!restaurantId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/menu/${restaurantId}`);
      const menuData: MenuResponse = response.data;
      setRestaurant(menuData);
      setCategories(menuData.categories);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erreur lors du chargement du menu";
      setError(errorMessage);
      message.error(errorMessage);
      console.error("Menu fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  return {
    restaurant,
    categories,
    loading,
    error,
    refetch: fetchMenu,
  };
};
