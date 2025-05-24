import { socketManager } from "@/utils/socketManager";
import { useEffect } from "react";

export const useOrderNotifications = (refetchPendingOrders: () => void) => {
  useEffect(() => {
    const unsubscribe = socketManager.subscribe(refetchPendingOrders);
    return unsubscribe;
  }, [refetchPendingOrders]);
};
