'use client'
import React from 'react';
import {
    Button,
    Modal,
    Input,
    Typography,
    Space,
    Form,
    notification,
} from 'antd';

import '@ant-design/v5-patch-for-react-19';
import { OrderRequest } from '@/types/order';
import { PhoneOutlined } from '@ant-design/icons';
import { useOrdersUser } from '@/hooks/useOrdersUser';

const { Title, Text } = Typography;

interface OrderFormModalProps {
    open: boolean;
    onClose: () => void;
    restaurant: { id: number };
    cart: { id: number; name: string; quantity: number; price: number }[];
    setCart: (items: any[]) => void;
    setCurrentOrder: any;
    getTotalPrice: () => number;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
    open,
    onClose,
    restaurant,
    cart,
    setCart,
    setCurrentOrder,
    getTotalPrice,
}) => {
    const [form] = Form.useForm();
    const { submitOrder, submitting } = useOrdersUser();

    const handleConfirmOrder = async () => {
        try {
            const values = await form.validateFields();

            const orderRequest: OrderRequest = {
                restaurantId: restaurant.id,
                items: cart.map(item => ({
                    dishId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: getTotalPrice(),
                phoneNumber: values.phoneNumber.replace(/\s/g, ''),

            };

            const order = await submitOrder(orderRequest);
            if (order) {
                setCurrentOrder(order);
                setCart([]);
                onClose();
                form.resetFields();

                notification.info({
                    message: 'Order Sent',
                    description: 'Your order is pending confirmation. You can vote or comment when it is accepted.',
                    placement: 'topRight',
                    duration: 6,
                });
            }
        } catch (err) {
        }
    };
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0 && !value.startsWith('213')) {
            if (value.length <= 9) {
                value = `+213${value}`;
            }
        } else if (value.startsWith('213') && value.length <= 12) {
            value = `+${value}`;
        }

        form.setFieldValue('phoneNumber', value);
    };

    return (
        <Modal
            title="Finalize Your Order"
            open={open}
            onCancel={onClose}
            footer={
                <Space>
                    <Button onClick={onClose}>Back</Button>
                    <Button type="primary" onClick={handleConfirmOrder} loading={submitting}>
                        Confirm Order
                    </Button>
                </Space>
            }
            width={500}
        >
            <div style={{ marginBottom: '24px' }}>
                <Title level={4}>Summary</Title>
                <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    {cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text>{item.name} x{item.quantity}</Text>
                            <Text strong>{(item.price * item.quantity).toFixed(2)} DZD</Text>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: '8px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text strong>Total</Text>
                            <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                                {getTotalPrice().toFixed(2)} DZD
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            <Title level={4}>Your Information</Title>
            <Form layout="vertical" form={form}>

                <Form.Item
                    label="Phone Number *"
                    name="phoneNumber"
                    rules={[
                        {
                            pattern: /^\+213[0-9]{9}$/,
                            message: 'Phone must be in format +213XXXXXXXXX (Algeria)'
                        }
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        onChange={handlePhoneChange}
                        placeholder="+213XXXXXXXXX"
                        maxLength={13}
                    />
                </Form.Item>


            </Form>
        </Modal>
    );
};
