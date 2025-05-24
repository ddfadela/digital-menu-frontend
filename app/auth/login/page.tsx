'use client'
import { Button, Card, Divider, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async (values: any) => {
        setLoading(true);
        try {
            const res = await signIn('credentials', {
                ...values,
                redirect: false,
                callbackUrl: '/admin',
            });

            if (res?.ok) {
                message.success('Login successful!');
                router.push('/admin');
            } else {
                message.error('Invalid credentials');
            }
        } catch (err) {
            message.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await signIn('google', {
                callbackUrl: '/admin',
            });
        } catch (err) {
            message.error('Google login failed');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card title="Login" style={{ width: 400 }} className="shadow-lg">
                <LoginForm
                    loading={loading}
                    googleLoading={googleLoading}
                    handleLogin={handleLogin}
                />

                <Divider className="text-gray-400">OR</Divider>

                <Button
                    onClick={handleGoogleLogin}
                    block
                    icon={<GoogleOutlined />}
                    loading={googleLoading}
                    disabled={loading}
                    style={{
                        borderColor: '#db4437',
                        color: '#db4437',
                    }}
                >
                    {googleLoading ? 'Connecting to Google...' : 'Sign in with Google'}
                </Button>
            </Card>
        </div>
    );
}
