import { Card, Typography, Spin } from 'antd';
import { useRestaurants } from '@/hooks/useRestaurants';

const { Title, Text } = Typography;

interface Props {
    onSelect: (restaurant: any) => void;
}

const RestaurantSelector = ({ onSelect }: Props) => {
    const { restaurants, loading } = useRestaurants();

    return (
        <div>
            <Title level={3}>Select a restaurant</Title>
            {loading ? (
                <Spin />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {restaurants
                        .filter((r) => r.isActive)
                        .map((restaurant) => (
                            <Card
                                key={restaurant.id}
                                hoverable
                                onClick={() => onSelect(restaurant)}
                                className="cursor-pointer"
                            >
                                <Title level={5}>{restaurant.name}</Title>
                                <Text type="secondary">{restaurant.location}</Text>
                            </Card>
                        ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantSelector;
