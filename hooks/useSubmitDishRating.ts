import { message } from "antd";
import apiClient from "@/utils/apiClient";

export const useSubmitDishRating = () => {
  const submitRating = async (dishId: number, rating: number) => {
    try {
      await apiClient.post("votes", { dishId, rating });
      message.success(`Rating submitted `);
    } catch (error) {
      console.error("Failed to submit rating:", error);
      message.error("Failed to submit rating");
      throw error;
    }
  };

  return { submitRating };
};
