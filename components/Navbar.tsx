import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Dropdown, Badge, MenuProps, Tooltip, message, Button } from 'antd';
import { LogoutOutlined, MenuOutlined, BellOutlined } from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { usePendingOrders } from '@/hooks/usePendingOrders';

const { Header } = Layout;

const Navbar: React.FC = () => {
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        pendingOrders,
        loadingPendingOrders,
        fetchPendingOrders,
    } = usePendingOrders();

    useOrderNotifications(fetchPendingOrders);
    const menuItems: MenuProps['items'] = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'logout') {
            signOut({ callbackUrl: '/login' });
        }
    };

    const getUserInitial = () => {
        const name = session?.user?.name;
        const email = session?.user?.email;
        if (name && name.length > 0) return name.charAt(0).toUpperCase();
        if (email && email.length > 0) return email.charAt(0).toUpperCase();
        return '?';
    };

    return (
        <>
            <Header
                style={{
                    background: '#fff',
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                }}
                className="shadow h-16 px-4 flex items-center justify-between"
            >
                <div
                    className="cursor-pointer text-lg md:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <MenuOutlined />
                </div>

                <div className="text-xl font-bold hidden md:block">🍽 Digital Menu</div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                    <Tooltip title="Commandes en attente">
                        <Badge count={loadingPendingOrders ? '...' : pendingOrders.length} >
                            <Button shape="circle" icon={<BellOutlined />} />
                        </Badge>
                    </Tooltip>


                    <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
                        <div className="cursor-pointer flex items-center gap-2">
                            <Avatar size="small">{getUserInitial()}</Avatar>
                        </div>
                    </Dropdown>
                </div>
            </Header>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </>
    );
};

export default Navbar;
