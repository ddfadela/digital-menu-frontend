'use client'
import { Button, Card, Divider, message, Typography } from 'antd';
import { GoogleOutlined, UserAddOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';


const { Title, Text } = Typography;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async (values: any) => {
        setLoading(true);
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: '/admin',

            });
            console.log('res', res)

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Card
                className="shadow-2xl border-0 rounded-xl"
                style={{
                    width: 450,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div className="text-center mb-8">
                    <Title level={2} className="text-gray-800 mb-2">
                        Welcome Back
                    </Title>
                    <Text className="text-gray-600">
                        Sign in
                    </Text>
                </div>

                <LoginForm
                    loading={loading}
                    googleLoading={googleLoading}
                    handleLogin={handleLogin}
                />

                <Divider className="text-gray-400 my-6">
                    <Text className="text-sm text-gray-500">Or continue with</Text>
                </Divider>

                <Button
                    onClick={handleGoogleLogin}
                    block
                    icon={<GoogleOutlined />}
                    loading={googleLoading}
                    disabled={loading}
                    className="h-12 rounded-lg border-2 mb-6 font-semibold transition-all duration-200 hover:shadow-lg"
                    style={{
                        borderColor: '#db4437',
                        color: '#db4437',
                        background: 'white'
                    }}
                >
                    {googleLoading ? 'Connecting to Google...' : 'Sign in with Google'}
                </Button>


                <Link href="/auth/register">
                    <Button
                        block
                        icon={<UserAddOutlined />}
                        className="h-12 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 border-none text-white font-semibold shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                    >
                        Create New Account
                    </Button>
                </Link>
            </Card>
        </div>
    );
}