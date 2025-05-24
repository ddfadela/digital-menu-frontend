import MenuDashboardClient from '@/components/menu/MenuDashboardClient';
import { authOptions } from '@/lib/nextAuth';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function MenuDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/login');
    }

    return <MenuDashboardClient />;
}
