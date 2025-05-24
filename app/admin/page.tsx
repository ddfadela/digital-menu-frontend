import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import AdminContent from '@/components/AdminContent';
import { authOptions } from '@/lib/nextAuth';

export default async function Admin() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/login');
        return null;
    }

    return (
        <AdminContent />
    );
}