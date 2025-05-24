'use client';
import { Tabs, Button, Card, Typography, Space, Tag, Spin, Modal, Form, Input, InputNumber, Switch, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useCategories } from '@/hooks/useCategories';
import { useDishes } from '@/hooks/useDishes';
import React, { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';

const { Title, Text } = Typography;
const { confirm } = Modal;

const MenuManager = ({ restaurant, onBack }: { restaurant: any; onBack: () => void }) => {
    const [menuTab, setMenuTab] = useState('categories');
    const [isDishModalOpen, setDishModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [editingDish, setEditingDish] = useState<any>(null);

    const {
        categories,
        loading: loadingCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchCategories
    } = useCategories(restaurant.id);

    const {
        dishes,
        loading: loadingDishes,
        creating: creatingDish,
        updating: updatingDish,
        createDish,
        updateDish,
        deleteDish
    } = useDishes(restaurant.id);

    const [form] = Form.useForm();
    const [categoryForm] = Form.useForm();

    const handleNewCategory = () => {
        setEditingCategory(null);
        categoryForm.resetFields();
        setCategoryModalOpen(true);
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category);
        categoryForm.setFieldsValue({
            name: category.name,
            description: category.description || ''
        });
        setCategoryModalOpen(true);
    };

    const handleCreateOrUpdateCategory = async (values: any) => {
        try {
            let success = false;
            if (editingCategory) {
                const updateData = {
                    name: values.name,
                    description: values.description
                };
                success = await updateCategory(editingCategory.id, updateData);
                if (success) {
                    message.success('Category updated successfully');
                }
            } else {
                success = await createCategory({
                    name: values.name,
                    description: values.description,
                    restaurantId: restaurant.id
                });
                if (success) {
                }
            }

            if (success) {
                setCategoryModalOpen(false);
                categoryForm.resetFields();
                setEditingCategory(null);
            }
        } catch (error) {
            message.error('Failed to save category');
            console.error('Error saving category:', error);
        }
    };

    const handleDeleteCategory = (category: any) => {
        confirm({
            title: 'Delete Category',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const success = await deleteCategory(category.id);
                    if (success) {
                        message.success('Category deleted successfully');
                    }
                } catch (error) {
                    message.error('Failed to delete category');
                    console.error('Error deleting category:', error);
                }
            },
        });
    };

    const handleNewDish = () => {
        setEditingDish(null);
        form.resetFields();
        form.setFieldsValue({
            available: true,
            price: undefined,
            description: undefined,
            categoryId: undefined
        });
        setDishModalOpen(true);
    };

    const handleEditDish = (dish: any) => {
        setEditingDish(dish);

        const formValues = {
            name: dish.name || '',
            price: dish.price ? Number(dish.price) : undefined,
            description: dish.description || undefined,
            categoryId: dish.categoryId || undefined,
            available: dish.available !== undefined ? dish.available : true
        };

        form.setFieldsValue(formValues);
        setDishModalOpen(true);
    };

    const handleCreateOrUpdateDish = async (values: any) => {
        try {
            let success = false;
            if (editingDish) {
                const updateData = {
                    name: values.name,
                    price: Number(values.price),
                    description: values.description,
                    available: values.available !== undefined ? values.available : true,
                    categoryId: values.categoryId,
                };
                success = await updateDish(editingDish.id, updateData);
                if (success) {

                }
            } else {
                const dishData = {
                    name: values.name,
                    price: Number(values.price),
                    description: values.description,
                    available: values.available !== undefined ? values.available : true,
                    restaurantId: restaurant.id,
                    categoryId: values.categoryId,
                };
                success = await createDish(dishData);
                if (success) {
                    message.success('Dish created successfully');
                }
            }

            if (success) {
                setDishModalOpen(false);
                form.resetFields();
                setEditingDish(null);
                await fetchCategories()
            }
        } catch (error) {
            message.error('Failed to save dish');
            console.error("Error saving dish:", error);
        }
    };

    const handleDeleteDish = (dish: any) => {
        confirm({
            title: 'Delete Dish',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete "${dish.name}"? This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const success = await deleteDish(dish.id);
                    if (success) {

                    }
                } catch (error) {
                    message.error('Failed to delete dish');
                    console.error('Error deleting dish:', error);
                }
            },
        });
    };

    const handleToggleDishAvailability = async (dish: any) => {
        try {
            // Only send the fields that can be updated
            const updateData = {
                name: dish.name,
                price: Number(dish.price),
                description: dish.description,
                available: !dish.available,
                categoryId: dish.categoryId,
            };
            const success = await updateDish(dish.id, updateData);
            if (success) {
                message.success(`Dish ${!dish.available ? 'enabled' : 'disabled'} successfully`);
            }
        } catch (error) {
            message.error('Failed to update dish availability');
            console.error('Error updating dish availability:', error);
        }
    };

    const CategoriesTab = () =>
        loadingCategories ? (
            <div className="flex justify-center py-8">
                <Spin size="large" />
            </div>
        ) : (
            <>
                <div className="flex justify-between items-center mb-4">
                    <Title level={4}>Categories ({categories.length})</Title>
                    <Button icon={<PlusOutlined />} type="primary" onClick={handleNewCategory}>
                        New Category
                    </Button>
                </div>
                {categories.length === 0 ? (
                    <Card>
                        <div className="text-center py-8">
                            <Text type="secondary">No categories found. Create your first category to get started.</Text>
                        </div>
                    </Card>
                ) : (
                    categories.map((cat) => (
                        <Card key={cat.id} className="mb-2">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <Title level={5} className="mb-1">{cat.name}</Title>
                                    {cat.description && (
                                        <Text type="secondary" className="block mb-2">{cat.description}</Text>
                                    )}
                                    <Text type="secondary">{cat.dishCount || 0} dishes</Text>
                                </div>
                                <Space>
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditCategory(cat)}
                                        type="text"
                                    />
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        type="text"
                                        onClick={() => handleDeleteCategory(cat)}
                                    />
                                </Space>
                            </div>
                        </Card>
                    ))
                )}
            </>
        );

    const DishesTab = () =>
        loadingDishes ? (
            <div className="flex justify-center py-8">
                <Spin size="large" />
            </div>
        ) : (
            <>
                <div className="flex justify-between items-center mb-4">
                    <Title level={4}>Dishes ({dishes.length})</Title>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={handleNewDish}
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        disabled={categories.length === 0}
                    >
                        New Dish
                    </Button>
                </div>
                {categories.length === 0 ? (
                    <Card>
                        <div className="text-center py-8">
                            <Text type="secondary">Create at least one category before adding dishes.</Text>
                        </div>
                    </Card>
                ) : dishes.length === 0 ? (
                    <Card>
                        <div className="text-center py-8">
                            <Text type="secondary">No dishes found. Create your first dish to get started.</Text>
                        </div>
                    </Card>
                ) : (
                    dishes.map((dish) => (

                        <Card key={dish.id} className="mb-2" >
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <Title level={5} className="mb-1">{dish.name}</Title>
                                    <Text strong className="block mb-2">{Number(dish.price).toFixed(2)} DA</Text>
                                    {dish.categoryName && (
                                        <Tag color="blue">{dish.categoryName}</Tag>
                                    )}
                                </div>
                                <Space>
                                    <Tag
                                        color={dish.available ? 'green' : 'red'}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleToggleDishAvailability(dish)}
                                    >
                                        {dish.available ? 'Available' : 'Unavailable'}
                                    </Tag>
                                    <Button
                                        icon={<EditOutlined />}
                                        type="text"
                                        onClick={() => handleEditDish(dish)}
                                    />
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        type="text"
                                        onClick={() => handleDeleteDish(dish)}
                                    />
                                </Space>
                            </div>
                        </Card>
                    ))
                )}
            </>
        );

    const tabItems = [
        {
            key: 'categories',
            label: `Categories (${categories.length})`,
            children: <CategoriesTab />,
        },
        {
            key: 'dishes',
            label: `Dishes (${dishes.length})`,
            children: <DishesTab />,
        },
    ];

    return (
        <>
            <div className="bg-white border rounded-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <Title level={3}>Menu - {restaurant.name}</Title>
                        <Text type="secondary">{restaurant.location}</Text>
                    </div>
                    <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                        Back
                    </Button>
                </div>
                <div className="p-6">
                    <Tabs activeKey={menuTab} onChange={setMenuTab} items={tabItems} />
                </div>
            </div>

            {/* Category Modal */}
            <Modal
                title={editingCategory ? 'Edit Category' : 'New Category'}
                open={isCategoryModalOpen}
                onOk={() => categoryForm.submit()}
                onCancel={() => {
                    setCategoryModalOpen(false);
                    categoryForm.resetFields();
                    setEditingCategory(null);
                }}
                okText={editingCategory ? 'Update' : 'Create'}
                cancelText="Cancel"
            >
                <Form form={categoryForm} layout="vertical" onFinish={handleCreateOrUpdateCategory}>
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[
                            { required: true, message: 'Please enter category name' },
                            { min: 2, message: 'Category name must be at least 2 characters' }
                        ]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { max: 500, message: 'Description cannot exceed 500 characters' }
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter category description (optional)"
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Dish Modal */}
            <Modal
                title={editingDish ? 'Edit Dish' : 'New Dish'}
                open={isDishModalOpen}
                onOk={() => form.submit()}
                onCancel={() => {
                    setDishModalOpen(false);
                    form.resetFields();
                    setEditingDish(null);
                }}
                okText={editingDish ? 'Update' : 'Create'}
                cancelText="Cancel"
                confirmLoading={creatingDish || updatingDish}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrUpdateDish}>
                    <Form.Item
                        name="name"
                        label="Dish Name"
                        rules={[
                            { required: true, message: 'Please enter dish name' },
                            { min: 2, message: 'Dish name must be at least 2 characters' }
                        ]}
                    >
                        <Input placeholder="Enter dish name" />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price (DA)"
                        rules={[
                            { required: true, message: 'Please enter price' },
                            { type: 'number', min: 0.01, message: 'Price must be greater than 0' }
                        ]}
                    >
                        <InputNumber
                            min={0}
                            step={0.01}
                            precision={2}
                            style={{ width: '100%' }}
                            placeholder="0.00"
                            formatter={value => `${value}`}

                        />
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
                            placeholder="Enter dish description (optional)"
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item
                        name="categoryId"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >

                        <Select
                            placeholder="Select a category"
                            loading={loadingCategories}
                            notFoundContent={loadingCategories ? <Spin size="small" /> : 'No categories found'}
                            allowClear
                        >
                            {categories.map((cat) => (
                                <Select.Option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="available"
                        label="Available"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Available" unCheckedChildren="Unavailable" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default MenuManager;