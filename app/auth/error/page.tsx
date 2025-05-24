'use client'
import { Card, Button, Typography, Alert } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExclamationCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { Suspense } from 'react';

const { Title, Text } = Typography;

function ErrorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams.get('error');

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case 'CredentialsSignin':
                return 'Invalid email or password. Please check your credentials and try again.';
            case 'OAuthSignin':
            case 'OAuthCallback':
            case 'OAuthCreateAccount':
                return 'There was an error with Google sign-in. Please try again.';
            case 'EmailCreateAccount':
                return 'Could not create account with this email.';
            case 'Callback':
                return 'Authentication callback error. Please try signing in again.';
            case 'OAuthAccountNotLinked':
                return 'This email is already associated with another account. Please sign in with your original method.';
            case 'EmailSignin':
                return 'Unable to send verification email.';
            case 'CredentialsCallback':
                return 'Authentication failed. Please check your credentials.';
            default:
                return 'An authentication error occurred. Please try again.';
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
            <Card
                className="shadow-2xl border-0 rounded-xl text-center"
                style={{
                    width: 450,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div className="mb-6">
                    <ExclamationCircleOutlined
                        className="text-red-500 text-6xl mb-4"
                    />
                    <Title level={2} className="text-gray-800 mb-2">
                        Authentication Error
                    </Title>
                </div>

                <Alert
                    message="Sign-in Failed"
                    description={getErrorMessage(error)}
                    type="error"
                    showIcon
                    className="mb-6 rounded-lg"
                />

                <div className="space-y-3">
                    <Button
                        type="primary"
                        block
                        size="large"
                        onClick={() => router.push('/auth/login')}
                        className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-none font-semibold"
                    >
                        Try Again
                    </Button>

                    <Button
                        block
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={() => router.push('/')}
                        className="h-12 rounded-lg border-2 border-gray-300 font-semibold"
                    >
                        Go Home
                    </Button>
                </div>

                {error && (
                    <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                        <Text className="text-xs text-gray-500">
                            Error Code: {error}
                        </Text>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
                <Card
                    className="shadow-2xl border-0 rounded-xl text-center"
                    style={{
                        width: 450,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="mb-6">
                        <ExclamationCircleOutlined
                            className="text-red-500 text-6xl mb-4"
                        />
                        <Title level={2} className="text-gray-800 mb-2">
                            Loading...
                        </Title>
                    </div>
                </Card>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    );
}