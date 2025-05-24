'use client';
import React from 'react';
import { Card, Col, Row, Statistic, Typography, Spin } from 'antd';
import { useAdminDashboard } from '@/hooks/useAdminDashboard ';

const { Title } = Typography;

const AdminContent: React.FC = () => {
    const { stats, loading } = useAdminDashboard();

    if (loading || !stats) {
        return <Spin size="large" className="mt-10" />;
    }

    return (
        <div className="p-6">
            <Title level={2}>Welcome to your Admin Dashboard</Title>

            <Row gutter={[16, 16]} className="mt-4">
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Users" value={stats.totalUsers} />
                    </Card>
                </Col>



                {/* New Cards for Orders and Restaurants */}
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Orders" value={stats.totalOrders} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Pending Orders" value={stats.pendingOrders} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Restaurants" value={stats.totalRestaurants} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminContent;
