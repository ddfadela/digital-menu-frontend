'use client';

import { useOrders } from '@/hooks/useOrders';
import { OrderStatus } from '@/types/order';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

const statusColors: Record<OrderStatus, string> = {
    pending: 'orange',
    accepted: 'green',
    rejected: 'red',
};


const RestaurantPage = () => {
    const { orders, loading } = useOrders();


    const columns: ColumnsType<any> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Phone number',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (text: string) => new Date(text).toLocaleString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: OrderStatus) => (
                <Tag color={statusColors[status]} className="uppercase font-medium">
                    {status}
                </Tag>
            ),
        },
    ];
    if (!orders) {
        return {
            notFound: true,
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={orders}
                loading={loading}
            />
        </div>
    );
};

export default RestaurantPage;
