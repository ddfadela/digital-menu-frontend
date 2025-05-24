
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default function LoginForm({
    loading,
    googleLoading,
    handleLogin,
}: {
    loading: boolean;
    googleLoading: boolean;
    handleLogin: (values: any) => void;
}) {
    return (
        <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                ]}
            >
                <Input
                    type="email"
                    prefix={<UserOutlined />}
                    placeholder="Enter your email"
                    disabled={loading || googleLoading}
                />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    disabled={loading || googleLoading}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    disabled={googleLoading}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </Form.Item>
        </Form>
    );
}
