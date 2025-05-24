import React, { useState } from 'react';
import { Dropdown, Button, Typography, Empty, Spin, MenuProps } from 'antd';
import { HistoryOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useOrdersStorage } from '@/hooks/useOrdersStorage';
import { OrderStatus, Order } from '@/types/order';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useSubmitComment } from '@/hooks/useSubmitComment';
import { useSubmitDishRating } from '@/hooks/useSubmitDishRating';

const { Text } = Typography;

export const OrdersDropdown: React.FC = () => {
    const { submitComment } = useSubmitComment()
    const { submitRating } = useSubmitDishRating()
    const router = useRouter();
    const { orders, loading, error } = useOrdersStorage();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case OrderStatus.PENDING:
                return <ClockCircleOutlined style={{ color: "orange" }} />;
            case OrderStatus.ACCEPTED:
                return <CheckCircleOutlined style={{ color: "green" }} />;
            case OrderStatus.REJECTED:
                return <CheckCircleOutlined style={{ color: "red" }} />;
        }
    };

    const calculateOrderTotal = (order: any): number => {
        if (!order.items || !Array.isArray(order.items)) {
            return 0;
        }
        return order.items.reduce((total: number, item: any) => {
            const itemTotal = (item.dish?.price || 0) * (item.quantity || 0);
            return total + itemTotal;
        }, 0);
    };


    const handleOrderClick = (order: any) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleSubmitItemRating = async (itemId: number, rating: number) => {

        await submitRating(itemId, rating);

    };

    const handleSubmitRestaurantComment = async (restaurantId: number, comment: string) => {

        await submitComment(restaurantId, comment);
    };

    const handleCloseModal = () => {
        setShowOrderModal(false);
        setSelectedOrder(null);
    };

    let items: MenuProps['items'] = [];

    if (loading) {
        items = [
            {
                key: 'loading',
                label: (
                    <div className="p-4 text-center">
                        <Spin size="small" />
                        <Text className="ml-2">Loading...</Text>
                    </div>
                ),
                disabled: true,
            }
        ];
    } else if (error) {
        items = [
            {
                key: 'error',
                label: (
                    <div className="p-4 text-center">
                        <Text type="danger">{error}</Text>
                    </div>
                ),
                disabled: true,
            }
        ];
    } else if (orders.length === 0) {
        items = [
            {
                key: 'empty',
                label: (
                    <div className="p-4 text-center">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No orders"
                            className="my-2"
                        />
                    </div>
                ),
                disabled: true,
            }
        ];
    } else {
        items = [
            {
                key: 'all-header',
                label: (
                    <div className="px-2 py-1">
                        <Text strong>All Orders</Text>
                    </div>
                ),
                disabled: true,
            },
            ...orders.map(order => {
                const orderTotal = calculateOrderTotal(order);

                const orderContent = (
                    <div className="px-2 py-2 hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between items-start">
                            <div>
                                <Text strong>{order.restaurant.name}</Text>
                                <div className="text-xs text-gray-500 mt-1">
                                    Commande #{order.id}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString('en-US')}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                {getStatusIcon(order.status)}
                                <Text
                                    className={`text-xs mt-1 ${order.status === 'pending' ? '!text-orange-500' :
                                        order.status === 'accepted' ? '!text-green-500' :
                                            (order.status === 'rejected' || order.status === 'cancelled') ? '!text-red-500' :
                                                ''
                                        }`}
                                >
                                    {order.status}
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">
                                    {orderTotal.toFixed(2)} DZD
                                </Text>
                            </div>
                        </div>
                    </div>
                );

                return {
                    key: order.id.toString(),
                    label: (
                        <div onClick={() => handleOrderClick(order)}>
                            {orderContent}
                        </div>
                    ),
                };
            })
        ];
    }

    return (
        <>
            <Dropdown
                menu={{
                    items,
                    style: {
                        maxHeight: '400px',
                        overflowY: 'auto',
                    }
                }}
                placement="bottomRight"
                trigger={['click']}
                overlayStyle={{
                    maxWidth: '320px',
                    maxHeight: '400px',
                }}
                overlayClassName="orders-dropdown-overlay"
            >
                <div className="fixed top-6 right-6 z-[1000]">
                    <Button
                        icon={<HistoryOutlined />}
                        loading={loading}
                    >
                        My Orders
                    </Button>
                </div>
            </Dropdown>

            <OrderDetailsModal
                open={showOrderModal}
                onClose={handleCloseModal}
                order={selectedOrder}
                onSubmitItemRating={handleSubmitItemRating}
                onSubmitRestaurantComment={handleSubmitRestaurantComment}
            />
        </>
    );
};