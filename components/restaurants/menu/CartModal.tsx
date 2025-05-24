'use client';
import React from 'react';
import {
    Button,
    Card,
    Modal,
    Typography,
    Space,
} from 'antd';
import {
    PlusOutlined,
    MinusOutlined,
} from '@ant-design/icons';
import { CartItem, Dish } from '@/types/dish';

const { Text } = Typography;

interface CartModalProps {
    showCart: boolean;
    setShowCart: (value: boolean) => void;
    cart: CartItem[];
    addToCart: (dish: Dish) => void;
    removeFromCart: (dishId: number) => void;
    getTotalPrice: () => number;
    setShowOrderForm: any;
}

export const CartModal: React.FC<CartModalProps> = ({
    showCart,
    setShowCart,
    cart,
    addToCart,
    removeFromCart,
    getTotalPrice,
    setShowOrderForm
}) => {

    return (
        <Modal
            title="Your Order"
            open={showCart}
            onCancel={() => setShowCart(false)}
            footer={
                cart.length > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <Text strong className="text-base">Total: {getTotalPrice().toFixed(2)} DZD</Text>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={() => {
                                setShowCart(false);
                                setShowOrderForm(true);
                            }}
                            className="bg-green-500 border-green-500"
                        >
                            Place Order
                        </Button>
                    </div>
                )
            }
            width={500}
        >
            {cart.length === 0 ? (
                <div className="text-center py-10">
                    <Text type="secondary">Your cart is empty</Text>
                </div>
            ) : (
                <div className="max-h-[400px] overflow-y-auto">
                    {cart.map(item => (
                        <Card key={item.id} size="small" className="mb-2">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <Text strong>{item.name}</Text>
                                    <br />
                                    <Text type="secondary">{item.price} DZD</Text>
                                </div>
                                <Space>
                                    <Button
                                        size="small"
                                        icon={<MinusOutlined />}
                                        onClick={() => removeFromCart(item.id)}
                                    />
                                    <Text>{item.quantity}</Text>
                                    <Button
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={() => addToCart(item)}
                                    />
                                </Space>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </Modal>
    );
};
