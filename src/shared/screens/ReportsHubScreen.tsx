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

interface ReportItem {
  id: string;
  name: string;
  icon: string;
  route: string;
}

const REPORTS: ReportItem[] = [
  {
    id: '1',
    name: 'Báo cáo doanh thu',
    icon: 'chart-line',
    route: ROUTES.BRANCH_REVENUE_REPORT,
  },
  {
    id: '2',
    name: 'Lịch sử làm việc',
    icon: 'history',
    route: ROUTES.EMPLOYEE_WORK_HISTORY,
  },
  {
    id: '3',
    name: 'Doanh thu nhân viên',
    icon: 'account-multiple',
    route: ROUTES.EMPLOYEE_REVENUE,
  },
];

const ReportsHubScreen = () => {
  const navigation = useNavigation();

  const renderReportCard = ({ item }: { item: ReportItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route as never)}
    >
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color="#FF6B6B" />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Báo Cáo"
        showBack={false}
        avatarUrl="https://your-avatar-url.com"
      />
      <View style={styles.content}>
        <FlatList
          data={REPORTS}
          renderItem={renderReportCard}
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
    backgroundColor: '#FFE5E5',
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

export default ReportsHubScreen;
