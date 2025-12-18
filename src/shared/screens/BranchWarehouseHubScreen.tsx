import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';

interface WarehouseItem {
  id: string;
  name: string;
  icon: string;
  route: string;
  color?: string;
}

const WAREHOUSE_ITEMS: WarehouseItem[] = [
  {
    id: 'warehouse-1',
    name: 'Kho Thuốc',
    icon: 'warehouse',
    route: ROUTES.WAREHOUSE_HUB,
    color: '#2196F3',
  },
  {
    id: 'warehouse-2',
    name: 'Nhập Hàng',
    icon: 'truck-delivery',
    route: ROUTES.IMPORT_LIST,
    color: '#4CAF50',
  },
];

const BranchWarehouseHubScreen = () => {
  const navigation = useNavigation();

  const renderWarehouseCard = ({ item }: { item: WarehouseItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route as never)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${item.color || '#2196F3'}20` },
        ]}
      >
        <Icon name={item.icon} size={32} color={item.color || '#2196F3'} />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Kho & Nhập Hàng"
        showBack={false}
        avatarUrl="https://your-avatar-url.com"
      />
      <View style={styles.content}>
        <FlatList
          data={WAREHOUSE_ITEMS}
          renderItem={renderWarehouseCard}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  gridContainer: {
    paddingVertical: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
});

export default BranchWarehouseHubScreen;
