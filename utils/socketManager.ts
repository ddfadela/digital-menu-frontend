import { io, Socket } from "socket.io-client";
import { notification } from "antd";

class SocketManager {
  private socket: Socket | null = null;
  private refreshCallbacks: Set<() => void> = new Set();

  connect() {
    if (!this.socket) {
      this.socket = io("http://localhost:3001");

      this.socket.on("newPendingOrder", () => {
        notification.open({
          message: "Order Changed",
        });

        this.refreshCallbacks.forEach((callback) => callback());
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(callback: () => void) {
    this.refreshCallbacks.add(callback);
    this.connect();

    return () => {
      this.refreshCallbacks.delete(callback);
    };
  }
}

export const socketManager = new SocketManager();
