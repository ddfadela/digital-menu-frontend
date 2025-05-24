'use client'
import React, { ReactNode, useState, useEffect } from 'react';
import { Layout } from 'antd';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import '@ant-design/v5-patch-for-react-19';
import SessionProviderWrapper from '@/providers/SessionProviderWrapper';

const { Content } = Layout;

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <SessionProviderWrapper>
            <Layout className="min-h-screen">
                <Navbar />
                <Layout className="flex-1">
                    <div className="hidden md:block">
                        <Sidebar />
                    </div>
                    <Content
                        className={`p-6 bg-gray-50 overflow-auto transition-all duration-300 ${isMounted ? 'md:ml-64' : ''
                            }`}
                        style={{
                            marginTop: 64,
                            minHeight: 'calc(100vh - 64px)',
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </SessionProviderWrapper>
    );
};

export default AdminLayout;