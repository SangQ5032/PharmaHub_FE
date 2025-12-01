import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { PayrollDetail } from '../types';
import { PayrollCard } from './PayrollCard';

interface PayrollListProps {
  payrolls: PayrollDetail[];
  loading?: boolean;
  onItemPress?: (payroll: PayrollDetail) => void;
  onApprove?: (payroll: PayrollDetail) => void;
  onReject?: (payroll: PayrollDetail) => void;
  showActions?: boolean;
  canApprove?: boolean;
  canReject?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListEmptyComponent?: React.ComponentType<any> | null;
  userRole?: string; // 'employee', 'system_admin', 'branch_manager', etc.
}

const DefaultEmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>Không có dữ liệu lương</Text>
  </View>
);

export const PayrollList: React.FC<PayrollListProps> = ({
  payrolls,
  loading = false,
  onItemPress,
  onApprove,
  onReject,
  showActions = false,
  canApprove = false,
  canReject = false,
  onRefresh,
  refreshing = false,
  ListEmptyComponent = DefaultEmptyComponent,
  userRole = 'employee',
}) => {
  const renderItem = ({ item }: { item: PayrollDetail }) => (
    <PayrollCard
      payroll={item}
      onPress={() => onItemPress?.(item)}
      onApprove={() => onApprove?.(item)}
      onReject={() => onReject?.(item)}
      showActions={showActions}
      canApprove={canApprove}
      canReject={canReject}
      userRole={userRole}
    />
  );

  if (loading && payrolls.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <FlatList
      data={payrolls}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      contentContainerStyle={payrolls.length === 0 ? styles.contentEmpty : null}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
