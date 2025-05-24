'use client';

import { useOrders } from '@/hooks/useOrders';
import { OrderStatus } from '@/types/order';
import {
    message,
    Spin,
    Button,
    Card,
    Typography,
    Row,
    Col,
    Space,
    Divider,
} from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { usePendingOrders } from '@/hooks/usePendingOrders';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';

const { Title, Text } = Typography;

const Page = () => {
    const {
        pendingOrders,
        loadingPendingOrders,
        fetchPendingOrders,
    } = usePendingOrders();

    useOrderNotifications(fetchPendingOrders);


    const { updateOrderStatus } = useOrders();

    const handleStatusChange = async (id: number, status: OrderStatus) => {
        const success = await updateOrderStatus(id, { status });
        if (!success) {
            message.error('Error when updating order status');
        }
    };
    if (!pendingOrders) {
        return {
            notFound: true,
        }
    }

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Pending Orders</Title>

            {loadingPendingOrders ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {pendingOrders.map((order) => (
                        <Col xs={24} sm={12} lg={8} key={order.id}>
                            <Card
                                title={`Commande #${order.id}`}
                                actions={[
                                    <Button
                                        type="primary"
                                        size="small"
                                        style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                                        onClick={() => handleStatusChange(order.id, OrderStatus.ACCEPTED)}
                                    >
                                        Confirmer
                                    </Button>,
                                    <Button
                                        danger
                                        size="small"
                                        onClick={() => handleStatusChange(order.id, OrderStatus.REJECTED)}
                                    >
                                        Refuser
                                    </Button>,
                                ]}
                            >
                                <Space direction="vertical" size="small">
                                    <Text type="secondary">
                                        <ClockCircleOutlined />{' '}
                                        {new Date(order.createdAt).toLocaleString()}
                                    </Text>
                                    <Text>
                                        <strong>Phone number:</strong> {order.phoneNumber}
                                    </Text>
                                </Space>

                                <Divider style={{ margin: '12px 0' }} />

                                <Text strong>Articles :</Text>
                                <ul style={{ paddingLeft: 16, marginTop: 8 }}>
                                    {order.items.map((item: any, index: any) => (
                                        <li key={index}>
                                            {item.dish.name} × {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Page;
