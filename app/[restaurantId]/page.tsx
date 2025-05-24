'use client';
import React, { useState } from 'react';
import {
    Button,
    Card,
    Badge,
    Typography,
    Row,
    Col,
    Spin,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    ShoppingCartOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { CartItem, Dish } from '@/types/dish';
import { useMenu } from '@/hooks/useMenu';
import { CartModal } from '@/components/restaurants/menu/CartModal';
import { Order } from '@/types/order';
import { useOrdersStorage } from '@/hooks/useOrdersStorage';
import { OrdersDropdown } from '@/components/restaurants/order/OrdersDropdown';
import { OrderFormModal } from '@/components/restaurants/order/OrderFormModal';

const { Title, Paragraph, Text } = Typography;

export default function Page({
    params,
}: {
    params: Promise<{ restaurantId: number }>;
}) {
    const paramsData = React.use(params);
    const restaurantId = Number(paramsData.restaurantId);

    const { restaurant, categories, loading, error, refetch } = useMenu(restaurantId);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState<boolean>(false);
    const [showOrderForm, setShowOrderForm] = React.useState(false);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    const addToCart = (dish: Dish): void => {
        const existingItem = cart.find(item => item.id === dish.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === dish.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...dish, quantity: 1 }]);
        }
    };

    const removeFromCart = (dishId: number): void => {
        const existingItem = cart.find(item => item.id === dishId);
        if (existingItem?.quantity && existingItem.quantity > 1) {
            setCart(cart.map(item =>
                item.id === dishId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ));
        } else {
            setCart(cart.filter(item => item.id !== dishId));
        }
    };

    const getTotalPrice = (): number =>
        cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const getTotalItems = (): number =>
        cart.reduce((total, item) => total + item.quantity, 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Text type="danger" className="text-lg mb-4">
                    {error || 'Restaurant not found'}
                </Text>
                <Button type="primary" onClick={refetch}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div
                className="relative h-[300px] flex items-end bg-cover bg-center"

            >
                <div className="absolute inset-0 bg-blue-900 bg-opacity-40" style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#1890ff',
                }} />

                <div className="absolute top-4 right-4 z-10">
                    <OrdersDropdown />
                </div>

                <div className="relative p-8 text-white z-10">
                    <Title level={1} className="!text-white mb-2">
                        {restaurant.name}
                    </Title>
                    {restaurant.location && (
                        <Paragraph className="!text-white mb-1">
                            <EnvironmentOutlined /> {restaurant.location}
                        </Paragraph>
                    )}
                    {restaurant.description && (
                        <Paragraph className="!text-white opacity-90 mb-0">
                            {restaurant.description}
                        </Paragraph>
                    )}
                </div>
            </div>

            {/* Menu */}
            <div className="max-w-screen-xl mx-auto p-8">
                {categories.length === 0 ? (
                    <div className="text-center py-10">
                        <Text type="secondary">No categories available</Text>
                    </div>
                ) : (
                    categories.map(category => (
                        <div key={category.id} className="mb-12">
                            <div className="text-center mb-4">
                                <Tag color="blue" style={{ fontSize: '16px', padding: '5px 12px' }}>
                                    {category.name}
                                </Tag>
                            </div>
                            <Row gutter={[24, 24]}>
                                {category.dishes.map(dish => (
                                    <Col key={dish.id} xs={24} md={12} lg={8}>
                                        <Card
                                            hoverable
                                            actions={[
                                                <Button
                                                    type="primary"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => addToCart(dish)}
                                                    block
                                                    key="add"
                                                >
                                                    Add to cart
                                                </Button>,
                                            ]}
                                        >
                                            <Card.Meta
                                                title={
                                                    <div className="flex justify-between items-start">
                                                        <Text strong>{dish.name}</Text>
                                                        <Text strong className="text-green-500 text-base">
                                                            {dish.price} DZD
                                                        </Text>
                                                    </div>
                                                }
                                                description={dish.description}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))
                )}
            </div>

            {/* Cart Button */}
            {getTotalItems() > 0 && (
                <div className="fixed bottom-6 right-6 z-[1000]">
                    <Badge count={getTotalItems()} offset={[-10, 5]}>
                        <Button
                            type="primary"
                            size="large"
                            shape="round"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => setShowCart(true)}
                            style={{
                                backgroundColor: '#52c41a',
                                borderColor: '#52c41a',
                            }}
                        >
                            View Cart
                        </Button>
                    </Badge>
                </div>
            )}

            <CartModal
                showCart={showCart}
                setShowCart={setShowCart}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                getTotalPrice={getTotalPrice}
                setShowOrderForm={setShowOrderForm}
            />

            <OrderFormModal
                open={showOrderForm}
                onClose={() => setShowOrderForm(false)}
                restaurant={restaurant}
                cart={cart}
                setCart={setCart}
                setCurrentOrder={setCurrentOrder}
                getTotalPrice={getTotalPrice}
            />
        </div>
    );
}
