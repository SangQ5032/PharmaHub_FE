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

interface StatisticsItem {
  id: string;
  name: string;
  icon: string;
  route: string;
  color?: string;
}

const STATISTICS_ITEMS: StatisticsItem[] = [
  {
    id: 'stat-1',
    name: 'Thống Kê Hệ Thống',
    icon: 'chart-box-multiple',
    route: ROUTES.SYSTEM_ADMIN_STATISTICS_MENU,
    color: '#4CAF50',
  },
  {
    id: 'stat-2',
    name: 'Báo Cáo Doanh Thu',
    icon: 'chart-line',
    route: ROUTES.BRANCH_REVENUE_REPORT,
    color: '#2196F3',
  },
];

const StatisticsHubScreen = () => {
  const navigation = useNavigation();

  const renderStatisticsCard = ({ item }: { item: StatisticsItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route as never)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${item.color || '#4CAF50'}20` },
        ]}
      >
        <Icon name={item.icon} size={32} color={item.color || '#4CAF50'} />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Thống Kê & Báo Cáo"
        showBack={false}
        avatarUrl="https://your-avatar-url.com"
      />
      <View style={styles.content}>
        <FlatList
          data={STATISTICS_ITEMS}
          renderItem={renderStatisticsCard}
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

export default StatisticsHubScreen;
