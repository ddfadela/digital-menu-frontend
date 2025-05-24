'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';
import '@ant-design/v5-patch-for-react-19';

const { Title, Text } = Typography;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (values: any) => {
        setLoading(true);

        try {
            const res = await fetch(`/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });


            if (res.ok) {
                message.success('Registration successful! Please login.');
                router.push('/auth/login');
            } else {
            }
        } catch (error) {
            console.error('Registration error:', error);
            message.error('An error occurred during registration');
        } finally {
            setLoading(false);
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
                        Create Account
                    </Title>

                </div>

                <Form
                    layout="vertical"
                    onFinish={handleRegister}
                    size="large"
                    className="space-y-4"
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Enter your full name"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Enter a valid email address' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                            placeholder="Enter your email address"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Create a strong password"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item className="mb-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Form.Item>
                </Form>

                <Divider className="text-gray-400 my-6">
                    <Text className="text-sm text-gray-500">Already have an account?</Text>
                </Divider>

                <Link href="/auth/login">
                    <Button
                        block
                        icon={<LoginOutlined />}
                        className="h-12 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                    >
                        Sign In to Your Account
                    </Button>
                </Link>


            </Card>
        </div>
    );
}