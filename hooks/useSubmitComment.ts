import { message } from "antd";
import apiClient from "@/utils/apiClient";

export const useSubmitComment = () => {
  const submitComment = async (restaurantId: number, content: string) => {
    try {
      await apiClient.post("/comments", { restaurantId, content });
      message.success("Thank you for your comment!");
    } catch (error) {
      message.error("Failed to submit comment");
      throw error;
    }
  };

  return { submitComment };
};
