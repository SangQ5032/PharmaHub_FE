import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetInvoicesByBranch, useGetInvoicesByMe } from '../hooks/useSales';
import { ROUTES } from '@shared/constants/routes';
import { Invoice } from '../types';

type TabType = 'branch' | 'me';

const InvoiceListScreen: React.FC = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const branchId = route?.params?.branchId;
  const [activeTab, setActiveTab] = useState<TabType>('branch');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Lấy dữ liệu cho cả 2 tab
  const {
    data: branchInvoicesData,
    isLoading: isBranchLoading,
    refetch: refetchBranch,
  } = useGetInvoicesByBranch({ page, limit, branch_id: branchId });

  const {
    data: meInvoicesData,
    isLoading: isMeLoading,
    refetch: refetchMe,
  } = useGetInvoicesByMe({ page, limit });

  // Chọn dữ liệu dựa trên tab active
  const isLoading = activeTab === 'branch' ? isBranchLoading : isMeLoading;
  const invoicesData =
    activeTab === 'branch' ? branchInvoicesData : meInvoicesData;

  // Xử lý response format từ API
  const invoices: Invoice[] = invoicesData?.data || [];
  const pagination = invoicesData?.pagination || { total: 0, totalPages: 0 };
  const total = pagination.total || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const handleInvoicePress = (invoice: Invoice) => {
    navigation.navigate(ROUTES.INVOICE_DETAIL, { invoiceId: invoice._id });
  };

  const renderInvoiceItem = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      style={styles.invoiceCard}
      onPress={() => handleInvoicePress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.invoiceCodeContainer}>
          <Text style={styles.invoiceCode}>{item.invoice_code}</Text>
          <Text style={styles.invoiceDate}>
            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.contentRow}>
          <Text style={styles.label}>Khách hàng:</Text>
          <Text style={styles.value}>{item.customer_name}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{item.customer_phone}</Text>
        </View>
        {activeTab === 'branch' && (
          <View style={styles.contentRow}>
            <Text style={styles.label}>Nhân viên:</Text>
            <Text style={styles.value}>{item.employee_id?.name || '-'}</Text>
          </View>
        )}
        <View style={styles.contentRow}>
          <Text style={styles.label}>Sản phẩm:</Text>
          <Text style={styles.value}>{item.items?.length || 0} mặt hàng</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>
            {item.payment_method === 'cash'
              ? 'Tiền mặt'
              : item.payment_method === 'card'
              ? 'Thẻ'
              : 'Chuyển khoản'}
          </Text>
        </View>
        <Text style={styles.totalAmount}>
          {item.total_amount?.toLocaleString('vi-VN')}₫
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleRefresh = () => {
    setPage(1);
    if (activeTab === 'branch') {
      refetchBranch();
    } else {
      refetchMe();
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'branch' && styles.tabActive]}
          onPress={() => handleTabChange('branch')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'branch' && styles.tabTextActive,
            ]}
          >
            Chi nhánh
          </Text>
          {activeTab === 'branch' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'me' && styles.tabActive]}
          onPress={() => handleTabChange('me')}
        >
          <Text
            style={[styles.tabText, activeTab === 'me' && styles.tabTextActive]}
          >
            Của tôi
          </Text>
          {activeTab === 'me' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading && invoices.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : invoices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === 'branch'
              ? 'Chưa có hóa đơn nào trong chi nhánh'
              : 'Bạn chưa tạo hóa đơn nào'}
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate(ROUTES.CREATE_INVOICE)}
          >
            <Text style={styles.createButtonText}>Tạo hóa đơn mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={item => item._id}
          renderItem={renderInvoiceItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            invoices.length > 0 && page < pagination.totalPages ? (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color="#0066CC" />
                <Text style={styles.loadMoreText}>Đang tải thêm...</Text>
              </View>
            ) : invoices.length > 0 ? (
              <View style={styles.endContainer}>
                <Text style={styles.endText}>
                  Đã hiển thị {invoices.length} / {total} hóa đơn
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.CREATE_INVOICE)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#FAFAFA',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#0066CC',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#0066CC',
    left: 0,
    right: 0,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  invoiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
    marginBottom: 8,
  },
  invoiceCodeContainer: {
    flex: 1,
  },
  invoiceCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  invoiceDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    flex: 0.4,
  },
  value: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    flex: 0.6,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066CC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  endContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  endText: {
    fontSize: 12,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
  },
});

export default InvoiceListScreen;
