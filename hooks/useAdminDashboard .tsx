import { useEffect, useState } from 'react';
import { message } from 'antd';
import apiClient from '@/utils/apiClient';

type Stats = {
    totalUsers: number;
    activeSessions: number;
    newSignups: number;
    revenue: number;
    totalOrders: number;
    pendingOrders: number;
    totalRestaurants: number;
};

export const useAdminDashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentActivity, setRecentActivity] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const statsRes = await apiClient.get('/admin/stats');
            setStats(statsRes.data);
        } catch (err) {
            message.error('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return {
        stats,
        recentActivity,
        loading,
        refetch: fetchDashboardData,
    };
};
