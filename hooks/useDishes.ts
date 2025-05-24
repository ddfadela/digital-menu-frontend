import { useState, useEffect } from "react";
import { message } from "antd";
import apiClient from "@/utils/apiClient";

export const useDishes = (restaurantId: number) => {
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/restaurants/${restaurantId}/dishes`);
      setDishes(res.data);
    } catch (err) {
      message.error("Error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createDish = async (values: Partial<any>) => {
    setCreating(true);
    try {
      await apiClient.post(`/dishes`, values);
      await fetchDishes();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error when creating";
      message.error(errorMessage);
      console.error("Create error:", err);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateDish = async (dishId: number, values: Partial<any>) => {
    setUpdating(true);
    try {
      await apiClient.patch(`/dishes/${dishId}`, values);
      message.success("Dish updated successfully");
      await fetchDishes();
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erreur when updating";
      message.error(errorMessage);
      console.error("Update error:", err);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteDish = async (dishId: number) => {
    setDeleting(true);
    try {
      await apiClient.delete(`/dishes/${dishId}`);
      message.success("Dish deleted successfully");
      await fetchDishes();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error when deleting";
      message.error(errorMessage);
      console.error("Delete error:", err);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (restaurantId) fetchDishes();
  }, [restaurantId]);

  return {
    dishes,
    loading,
    creating,
    updating,
    deleting,
    refetch: fetchDishes,
    createDish,
    updateDish,
    deleteDish,
  };
};
