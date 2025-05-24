import React, { useState } from 'react';
import {
    Modal,
    Typography,
    Card,
    Row,
    Col,
    Button,
    Rate,
    Input,
    Divider,
    Tag,
    Space,
    Avatar,
} from 'antd';
import {
    ShoppingCartOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CommentOutlined,
} from '@ant-design/icons';
import { Order, OrderStatus } from '@/types/order';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface OrderDetailsModalProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
    onSubmitItemRating?: (itemId: number, rating: number) => Promise<void>;
    onSubmitRestaurantComment?: (restaurantId: number, comment: string) => Promise<void>;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    open,
    onClose,
    order,
    onSubmitItemRating,
    onSubmitRestaurantComment,
}) => {
    const [restaurantComment, setRestaurantComment] = useState<string>('');
    const [submittingComment, setSubmittingComment] = useState<boolean>(false);
    const [ratingLoading, setRatingLoading] = useState<{ [key: number]: boolean }>({});

    const handleItemRating = async (itemId: number, rating: number) => {
        if (!order || !onSubmitItemRating) return;

        try {
            setRatingLoading(prev => ({ ...prev, [itemId]: true }));
            await onSubmitItemRating(itemId, rating);
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setRatingLoading(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleSubmitRestaurantComment = async () => {
        if (!order || !onSubmitRestaurantComment || !restaurantComment.trim()) return;

        try {
            setSubmittingComment(true);
            await onSubmitRestaurantComment(order.restaurant.id, restaurantComment);
            setRestaurantComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'orange';
            case OrderStatus.ACCEPTED:
                return 'green';
            case OrderStatus.REJECTED:
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case OrderStatus.PENDING:
                return <ClockCircleOutlined />;
            case OrderStatus.ACCEPTED:
                return <CheckCircleOutlined />;
            case OrderStatus.REJECTED:
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const calculateTotal = () => {
        if (!order) return 0;
        return order.items.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
    };

    if (!order) return null;

    const canInteract = order.status === OrderStatus.ACCEPTED;
    const totalPrice = calculateTotal();

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            title={
                <div className="flex items-center gap-3">
                    <ShoppingCartOutlined className="text-blue-500" />
                    <span>Order Details #{order.id}</span>
                    <Tag
                        color={getStatusColor(order.status)}
                        icon={getStatusIcon(order.status)}
                    >
                        {order.status}
                    </Tag>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Restaurant Info */}
                <Card size="small">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={64}
                            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop"
                            icon={<EnvironmentOutlined />}
                        />
                        <div>
                            <Title level={4} className="!mb-1">
                                {order.restaurant.name}
                            </Title>
                            {order.restaurant.location && (
                                <Text type="secondary">
                                    <EnvironmentOutlined /> {order.restaurant.location}
                                </Text>
                            )}
                            <div className="mt-2">
                                <Text type="secondary">
                                    Ordered on {formatDate(order.createdAt)}
                                </Text>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Order Items */}
                <div>
                    <Title level={5} className="flex items-center gap-2 !mb-4">
                        <ShoppingCartOutlined />
                        Ordered Items
                    </Title>
                    <Row gutter={[16, 16]}>
                        {order.items.map((item, index) => (
                            <Col span={24} key={index}>
                                <Card size="small" className="shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <Text strong className="text-base">
                                                {item.dish.name}
                                            </Text>
                                            {item.dish.description && (
                                                <Paragraph
                                                    type="secondary"
                                                    className="!mb-2 !mt-1"
                                                    ellipsis={{ rows: 2 }}
                                                >
                                                    {item.dish.description}
                                                </Paragraph>
                                            )}

                                            {/* Item Rating */}
                                            {canInteract && (
                                                <div className="mt-3">
                                                    <Text className="block mb-1 text-sm">Rate this item:</Text>
                                                    <Rate
                                                        value={0}
                                                        onChange={(rating) => handleItemRating(item.id, rating)}
                                                        disabled={ratingLoading[item.id]}
                                                        className="text-sm"
                                                    />
                                                    {ratingLoading[item.id] && (
                                                        <Text type="secondary" className="ml-2 text-xs">
                                                            Submitting...
                                                        </Text>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right ml-4">

                                            <Text strong className="text-green-600 text-lg">
                                                {item.dish.price * item.quantity} DZD
                                            </Text>
                                            <div>
                                                <Text type="secondary" className="text-sm">
                                                    {item.dish.price} DZD × {item.quantity}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Order Summary */}
                <Card size="small" className="bg-gray-50">
                    <div className="flex justify-between items-center">
                        <Text strong className="text-lg">Order Total:</Text>
                        <Text strong className="text-xl text-green-600">
                            {totalPrice} DZD
                        </Text>
                    </div>
                    <Divider className="!my-3" />
                </Card>


                {/* Restaurant Comment Form */}
                {canInteract && (
                    <div>
                        <Title level={5} className="flex items-center gap-2 !mb-3">
                            <CommentOutlined />
                            Comment about
                        </Title>
                        <Card size="small" className="bg-green-50 border-green-200">
                            <Space direction="vertical" className="w-full">
                                <div>
                                    <Text className="block mb-2">Share your experience with this restaurant:</Text>
                                    <TextArea
                                        value={restaurantComment}
                                        onChange={(e) => setRestaurantComment(e.target.value)}
                                        placeholder="How was your overall experience with this restaurant?"
                                        rows={3}
                                        maxLength={500}
                                        showCount
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="primary"
                                        icon={<CommentOutlined />}
                                        onClick={handleSubmitRestaurantComment}
                                        loading={submittingComment}
                                        disabled={!restaurantComment.trim()}
                                    >
                                        Submit Comment
                                    </Button>
                                </div>
                            </Space>
                        </Card>
                    </div>
                )}


            </div>
        </Modal>
    );
};