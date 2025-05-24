import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Restaurant } from '@/types/restaurant';

const { TextArea } = Input;

interface RestaurantModalProps {
    open: boolean;
    editingRestaurant: Restaurant | null;
    onSubmit: (values: any) => Promise<void>;
    onCancel: () => void;
}

const RestaurantModal = ({
    open,
    editingRestaurant,
    onSubmit,
    onCancel
}: RestaurantModalProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (editingRestaurant) {
                form.setFieldsValue(editingRestaurant);
            } else {
                form.resetFields();
            }
        }
    }, [open, editingRestaurant, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0 && !value.startsWith('213')) {
            if (value.length <= 9) {
                value = `+213${value}`;
            }
        } else if (value.startsWith('213') && value.length <= 12) {
            value = `+${value}`;
        }

        form.setFieldValue('phone', value);
    };

    return (
        <Modal
            title={editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}
            open={open}
            onOk={handleSubmit}
            onCancel={onCancel}
            okText="Save"
            width={600}
            destroyOnHidden
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Restaurant Name"
                    rules={[
                        { required: true, message: 'Please enter restaurant name' },
                        { min: 2, max: 100, message: 'Name must be between 2 and 100 characters' },
                        { whitespace: true, message: 'Name cannot be only whitespace' }
                    ]}
                >
                    <Input placeholder="Enter restaurant name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { max: 500, message: 'Description cannot exceed 500 characters' }
                    ]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Enter restaurant description (optional)"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item
                    name="location"
                    label="Location"
                    rules={[
                        { min: 2, max: 200, message: 'Location must be between 2 and 200 characters' },
                        { whitespace: true, message: 'Location cannot be only whitespace' }
                    ]}
                >
                    <Input
                        prefix={<EnvironmentOutlined />}
                        placeholder="Enter location (optional)"
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        {
                            pattern: /^\+213[0-9]{9}$/,
                            message: 'Phone must be in format +213XXXXXXXXX (Algeria)'
                        }
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="+213XXXXXXXXX (optional)"
                        onChange={handlePhoneChange}
                        maxLength={13}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { type: 'email', message: 'Please enter a valid email address' }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Enter email address (optional)"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RestaurantModal;