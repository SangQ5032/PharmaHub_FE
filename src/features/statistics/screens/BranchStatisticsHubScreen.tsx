import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextStyle,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES } from '@shared/constants/routes';
import { StatsGrid, StatsSection } from '../components/StatCard';
import {
  useRevenueStats,
  useBatchStatusStats,
} from '../hooks/useBranchStatistics';

type NavigationProp = NativeStackNavigationProp<any>;

interface BranchStatisticsHubScreenProps {
  navigation: NavigationProp;
}

/**
 * Màn hình Hub chính cho Branch Manager Statistics
 * Hiển thị tổng quan các chỉ số quan trọng
 */
export const BranchStatisticsHubScreen: React.FC<
  BranchStatisticsHubScreenProps
> = ({ navigation }) => {
  const { data: revenueData, isLoading: revenueLoading } = useRevenueStats();
  const { data: batchStatusData, isLoading: batchLoading } =
    useBatchStatusStats();

  const handleNavigate = (route: string) => {
    navigation.navigate(route);
  };

  const statisticsMenus = [
    {
      id: 'revenue',
      title: 'Doanh Thu Chi Nhánh',
      description: 'Thống kê doanh thu tổng hợp',
      icon: 'chart-line',
      color: '#27ae60',
      route: ROUTES.BRANCH_REVENUE_STATS,
    },
    {
      id: 'employees',
      title: 'Doanh Thu Nhân Viên',
      description: 'So sánh doanh thu từng nhân viên',
      icon: 'account-group',
      color: '#3498db',
      route: ROUTES.BRANCH_EMPLOYEES_STATS,
    },
    {
      id: 'medicines',
      title: 'Bán Hàng Theo Thuốc',
      description: 'Chi tiết thuốc bán ra',
      icon: 'pill',
      color: '#e74c3c',
      route: ROUTES.BRANCH_MEDICINES_STATS,
    },
    {
      id: 'imports',
      title: 'Lô Hàng Đã Nhập',
      description: 'Lịch sử nhập hàng',
      icon: 'truck-delivery',
      color: '#f39c12',
      route: ROUTES.BRANCH_IMPORTS_STATS,
    },
    {
      id: 'batch-status',
      title: 'Tình Trạng Lô Hàng',
      description: 'Kiểm tra tồn kho & hạn sử dụng',
      icon: 'warehouse',
      color: '#9b59b6',
      route: ROUTES.BRANCH_BATCH_STATUS_STATS,
    },
    {
      id: 'customers',
      title: 'Doanh Thu Khách Hàng',
      description: 'Phân tích theo khách hàng',
      icon: 'account-tie',
      color: '#1abc9c',
      route: ROUTES.BRANCH_CUSTOMERS_STATS,
    },
    {
      id: 'period',
      title: 'Xu Hướng Doanh Thu',
      description: 'Doanh thu theo thời gian',
      icon: 'chart-box',
      color: '#34495e',
      route: ROUTES.BRANCH_REVENUE_BY_PERIOD_STATS,
    },
  ];

  const isLoading = revenueLoading || batchLoading;

  return (
    <ScrollView style={styles.container}>
      {/* Overview Section */}
      {!isLoading && revenueData && batchStatusData && (
        <StatsSection title="Tổng Quan">
          <StatsGrid
            stats={[
              {
                title: 'Tổng Doanh Thu',
                value: revenueData.totalRevenue,
                valueFormat: 'currency',
                color: '#27ae60',
              },
              {
                title: 'Số Hóa Đơn',
                value: revenueData.totalInvoices,
                valueFormat: 'number',
                color: '#3498db',
              },
              {
                title: 'Tồn Kho Còn',
                value: batchStatusData.summary.inStock,
                subtitle: 'lô hàng',
                valueFormat: 'number',
                color: '#9b59b6',
              },
              {
                title: 'Sắp Hết Hạn',
                value: batchStatusData.summary.expiringSoon,
                subtitle: '≤ 30 ngày',
                valueFormat: 'number',
                color: '#e74c3c',
              },
            ]}
            columns={2}
          />
        </StatsSection>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      )}

      {/* Statistics Menu */}
      <StatsSection title="Các Chức Năng Thống Kê">
        <View style={styles.menuGrid}>
          {statisticsMenus.map(menu => (
            <View key={menu.id} style={styles.menuItemWrapper}>
              <Card style={styles.menuCard}>
                <Card.Content>
                  <View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: menu.color },
                    ]}
                  >
                    <Text style={styles.menuIcon}>📊</Text>
                  </View>
                  <Text style={styles.menuTitle} numberOfLines={2}>
                    {menu.title}
                  </Text>
                  <Text style={styles.menuDescription} numberOfLines={2}>
                    {menu.description}
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="text"
                    onPress={() => handleNavigate(menu.route)}
                    labelStyle={styles.menuButtonLabel}
                  >
                    Xem
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          ))}
        </View>
      </StatsSection>

      {/* Tips Section */}
      <StatsSection title="Hướng Dẫn">
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.tipsTitle}>💡 Lời khuyên:</Text>
            <Text style={styles.tipsText}>
              • Kiểm tra tình trạng lô hàng hàng ngày{'\n'}• Theo dõi doanh thu
              để xác định xu hướng{'\n'}• Đánh giá hiệu suất nhân viên hàng
              tháng{'\n'}• Phân loại khách hàng theo giá trị
            </Text>
          </Card.Content>
        </Card>
      </StatsSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7f8c8d',
  } as TextStyle,
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  menuItemWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  menuIconContainer: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 28,
  } as TextStyle,
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  } as TextStyle,
  menuDescription: {
    fontSize: 11,
    color: '#7f8c8d',
  } as TextStyle,
  menuButtonLabel: {
    fontSize: 12,
    marginRight: -8,
  } as TextStyle,
  tipsCard: {
    backgroundColor: '#fef9e7',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  } as any,
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f39c12',
    marginBottom: 8,
  } as TextStyle,
  tipsText: {
    fontSize: 12,
    color: '#7d6608',
    lineHeight: 18,
  } as TextStyle,
});
