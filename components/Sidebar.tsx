import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'

import { Layout, Menu, MenuProps, Drawer } from 'antd';
import {
    DashboardOutlined,
    MenuOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
    isOpen = false,
    onClose
}) => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const menuItems: MenuProps['items'] = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/restaurants',
            icon: <ShoppingOutlined />,
            label: 'Restaurants',
        },
        {
            key: '/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Orders',
            children: [
                { key: '/admin/orders/pending', label: 'Pending Orders' },
                { key: '/admin/orders', label: 'All Orders' },
            ],
        },
        {
            key: '/admin/menus',
            icon: <MenuOutlined />,
            label: 'Menus',
        },
    ];

    const handleClick: MenuProps['onClick'] = ({ key }) => {
        router.push(key);

        if (isMobile && onClose) {
            onClose();
        }
    };

    const pathname = usePathname();

    const menuContent = (
        <Menu
            theme="light"
            mode="inline"
            onClick={handleClick}
            selectedKeys={[pathname]}
            items={menuItems}
            style={{
                borderRight: 0,
                height: '100%',
                overflowY: 'auto',
            }}
        />
    );

    if (isMobile) {
        return (
            <Drawer
                title="🍽 Digital Menu"
                placement="left"
                onClose={onClose}
                open={isOpen}
                width={256}
                styles={{
                    body: { padding: 0 }
                }}
            >
                {menuContent}
            </Drawer>
        );
    }

    return (
        <Sider
            trigger={null}
            collapsible={false}
            width={256}
            style={{
                height: 'calc(100vh - 64px)',
                position: 'fixed',
                left: 0,
                top: 64,
                zIndex: 100,
            }}
        >
            {menuContent}
        </Sider>
    );
};

export default Sidebar;