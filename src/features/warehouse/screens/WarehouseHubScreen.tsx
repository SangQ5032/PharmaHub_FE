import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HubCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

const WarehouseHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const hubCards: HubCard[] = [
    {
      id: 'inventory',
      title: 'Tồn Kho Thuốc',
      description: 'Xem danh sách thuốc và số lượng tồn kho tại chi nhánh',
      icon: 'package-variant-closed',
      color: '#1E88E5',
      route: ROUTES.INVENTORY_LIST,
    },
    {
      id: 'batches',
      title: 'Lô Thuốc',
      description: 'Quản lý lô thuốc, hạn sử dụng và giá nhập',
      icon: 'barcode',
      color: '#F57C00',
      route: ROUTES.INVENTORY_LIST, // TODO: Change to batch list route when available
    },
  ];

  const handleCardPress = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Icon name="warehouse" size={40} color="#333" />
          <Text style={styles.headerTitle}>Quản Lý Tồn Kho</Text>
          <Text style={styles.headerSubtitle}>
            Quản lý tồn kho thuốc tại chi nhánh
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {hubCards.map(card => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => handleCardPress(card.route)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.cardIconContainer,
                  { backgroundColor: card.color },
                ]}
              >
                <Icon name={card.icon} size={40} color="#FFF" />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
              <View style={styles.cardFooter}>
                <Icon name="chevron-right" size={24} color={card.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default WarehouseHubScreen;
