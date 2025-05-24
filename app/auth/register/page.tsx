'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';

const { Title } = Typography;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (values: any) => {
        setLoading(true);

        const res = await fetch(`/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });

        setLoading(false);

        if (res.ok) {
            router.push('/auth/login');
        } else {
            const err = await res.json();
            alert(err.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <Card title={<Title level={3}>Register</Title>} style={{ width: 400 }}>
                <Form layout="vertical" onFinish={handleRegister}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Enter a valid email' },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>

            </Card>
        </div>
    );
}
