import { Restaurant } from '@/types/restaurant';
import { Table, Button, Space, Popconfirm, Switch } from 'antd';

interface RestaurantTableProps {
    restaurants: Restaurant[];
    loading: boolean;
    onEdit: (restaurant: Restaurant) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number, currentStatus: boolean) => void;
}

const RestaurantTable = ({
    restaurants,
    loading,
    onEdit,
    onDelete,
    onToggleStatus
}: RestaurantTableProps) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 150,
            sorter: (a: Restaurant, b: Restaurant) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: 200,
            render: (text: string) => text ? (text.length > 50 ? `${text.substring(0, 50)}...` : text) : '-',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: 150,
            render: (text: string) => text || '-',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: 130,
            render: (text: string) => text || '-',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 180,
            render: (text: string) => text || '-',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            width: 120,
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value: boolean | string, record: Restaurant) => record.isActive === value,
            render: (active: boolean, record: Restaurant) => (
                <Switch
                    checked={active}
                    onChange={() => onToggleStatus(record.id, active)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    size="small"
                />
            ),
        },
        {
            title: 'Actions',
            width: 150,
            render: (_: any, record: Restaurant) => (
                <Space>
                    <Button size="small" onClick={() => onEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Restaurant"
                        description="Are you sure you want to delete this restaurant?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button size="small" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={restaurants}
            columns={columns}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1000 }}
            size="middle"
            pagination={{
                pageSize: 50,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} restaurants`,
            }}
        />
    );
};

export default RestaurantTable;