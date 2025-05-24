import { useState, useEffect } from "react";
import { message } from "antd";
import apiClient from "@/utils/apiClient";

export const useCategories = (restaurantId: number) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/restaurants/${restaurantId}/categories`
      );
      setCategories(res.data);
    } catch (err) {
      message.error("Échec du chargement des catégories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (values: Partial<any>) => {
    setCreating(true);
    try {
      await apiClient.post(`/categories`, values);
      message.success("Category created successfully");
      await fetchCategories();
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erreur lors de la création";
      message.error(errorMessage);
      console.error("Create error:", err);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateCategory = async (categoryId: number, values: Partial<any>) => {
    setUpdating(true);
    try {
      await apiClient.patch(`/categories/${categoryId}`, values);
      message.success("Catégorie mise à jour avec succès");
      await fetchCategories();
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erreur lors de la mise à jour";
      message.error(errorMessage);
      console.error("Update error:", err);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteCategory = async (categoryId: number) => {
    setDeleting(true);
    try {
      await apiClient.delete(`/categories/${categoryId}`);
      await fetchCategories();
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erreur lors de la suppression";
      message.error(errorMessage);
      console.error("Delete error:", err);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (restaurantId) fetchCategories();
  }, [restaurantId]);

  return {
    categories,
    loading,
    creating,
    updating,
    deleting,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
