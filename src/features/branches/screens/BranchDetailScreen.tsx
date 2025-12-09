import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBranch } from '../hooks/useBranches';
import { useGetInventoryByBranch } from '@features/warehouse/hooks/useInventory';
import { useGetInvoicesByBranch } from '@features/sales/hooks/useSales';
import { useBranchUsers } from '@shared/hooks/useUsers';
import { ROUTES } from '@shared/constants/routes';

const StatCard: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value ?? '—'}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function BranchDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { branchId, branchName } = route?.params || {};

  const { data: branchData, isLoading: branchLoading } = useBranch(branchId);

  // Inventory count (use small page to get pagination.total)
  const { data: invData, isLoading: invLoading } = useGetInventoryByBranch(
    branchId || '',
    { page: 1, limit: 1 },
  );

  // Invoice count via sales hook
  const { data: invcData, isLoading: invcLoading } = useGetInvoicesByBranch({
    page: 1,
    limit: 1,
    branch_id: branchId,
  });

  // Employee count from branch users
  const { data: usersData, isLoading: usersLoading } = useBranchUsers(branchId);

  const loading = branchLoading || invLoading || invcLoading || usersLoading;

  const branch = branchData?.data ?? branchData;

  const inventoryCount =
    invData?.pagination?.total ??
    (invData?.data ? invData.data.length : undefined);
  const invoiceCount =
    invcData?.pagination?.total ??
    (invcData?.data ? invcData.data.length : undefined);
  const employeeCount = usersData?.data ? usersData.data.length : undefined;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {branch?.name || branchName || 'Chi nhánh'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin chi nhánh</Text>
        <Text style={styles.infoLabel}>Địa chỉ</Text>
        <Text style={styles.infoValue}>{branch?.address ?? '—'}</Text>

        <Text style={styles.infoLabel}>Số điện thoại</Text>
        <Text style={styles.infoValue}>{branch?.phone ?? '—'}</Text>

        <Text style={styles.infoLabel}>Mục tiêu doanh thu</Text>
        <Text style={styles.infoValue}>
          {branch?.revenue_target
            ? `${branch.revenue_target.toLocaleString('vi-VN')}₫`
            : '—'}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate(ROUTES.ADD_EDIT_BRANCH, {
                mode: 'edit',
                item: branch,
              })
            }
          >
            <Text style={styles.editText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Tồn kho" value={inventoryCount} />
        <StatCard label="Hoá đơn" value={invoiceCount} />
        <StatCard label="Nhân viên" value={employeeCount} />
        <StatCard label="Báo cáo" value={''} />
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate(ROUTES.BRANCH_EMPLOYEE_INFO_MENU, {
              branchId,
              branchName: branch?.name || branchName,
            })
          }
        >
          <Text style={styles.menuTitle}>Nhân viên</Text>
          <Text style={styles.menuSubtitle}>Thông tin nhân viên</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate(ROUTES.INVOICE_LIST, { branchId } as any)
          }
        >
          <Text style={styles.menuTitle}>Hoá đơn</Text>
          <Text style={styles.menuSubtitle}>Danh sách hoá đơn chi nhánh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate(ROUTES.INVENTORY_LIST, { branchId } as any)
          }
        >
          <Text style={styles.menuTitle}>Tồn kho</Text>
          <Text style={styles.menuSubtitle}>Xem tồn kho chi nhánh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate(ROUTES.BRANCH_REVENUE_REPORT as any)
          }
        >
          <Text style={styles.menuTitle}>Thống kê</Text>
          <Text style={styles.menuSubtitle}>Báo cáo & thống kê</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  back: { color: '#666', marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  infoLabel: { color: '#777', marginTop: 8 },
  infoValue: { fontSize: 15, color: '#222', marginTop: 2 },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  editText: { color: '#fff', fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '800', color: '#333' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  menuTitle: { fontSize: 15, fontWeight: '700' },
  menuSubtitle: { fontSize: 12, color: '#666', marginTop: 6 },
});
