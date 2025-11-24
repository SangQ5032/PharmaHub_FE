import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useGetInvoicesByBranch } from '../hooks/useSales';
import { ROUTES } from '@shared/constants/routes';
import { Invoice } from '../types';

const BranchInvoiceHistoryScreen: React.FC = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const branchId = route?.params?.branchId;

  // Filter states
  const [page, setPage] = useState(1);
  const limit = 20;
  const [filters, setFilters] = useState({
    employee_id: '',
    customer_id: '',
    from_date: '',
    to_date: '',
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');

  // Fetch data with filters
  const {
    data: invoicesData,
    isLoading,
    refetch,
    isFetching,
  } = useGetInvoicesByBranch({
    page,
    limit,
    branch_id: branchId,
    employee_id: filters.employee_id || undefined,
    customer_id: filters.customer_id || undefined,
    from_date: filters.from_date || undefined,
    to_date: filters.to_date || undefined,
  });

  // Handle response format
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

  const handleApplyFilters = () => {
    setPage(1);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilters({
      employee_id: '',
      customer_id: '',
      from_date: '',
      to_date: '',
    });
    setSearchCustomer('');
    setSearchEmployee('');
    setPage(1);
  };

  const isFiltersActive =
    filters.employee_id ||
    filters.customer_id ||
    filters.from_date ||
    filters.to_date;

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
          <Text style={styles.label}>SĐT:</Text>
          <Text style={styles.value}>{item.customer_phone}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.label}>Nhân viên:</Text>
          <Text style={styles.value}>{item.employee_id?.name || '-'}</Text>
        </View>
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

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  return (
    <View style={styles.container}>
      {/* Header with filter button */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Lịch sử hoá đơn</Text>
        <TouchableOpacity
          style={[
            styles.filterButton,
            isFiltersActive && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Icon
            name="filter-variant"
            size={20}
            color={isFiltersActive ? '#FFF' : '#0066CC'}
          />
          {isFiltersActive && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      {/* Active filters display */}
      {isFiltersActive && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.employee_id && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  NV: {searchEmployee.substring(0, 10)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setFilters({ ...filters, employee_id: '' });
                    setSearchEmployee('');
                  }}
                >
                  <Icon name="close" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            {filters.customer_id && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  KH: {searchCustomer.substring(0, 10)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setFilters({ ...filters, customer_id: '' });
                    setSearchCustomer('');
                  }}
                >
                  <Icon name="close" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            {filters.from_date && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  Từ: {filters.from_date}
                </Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, from_date: '' })}
                >
                  <Icon name="close" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            {filters.to_date && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  Đến: {filters.to_date}
                </Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, to_date: '' })}
                >
                  <Icon name="close" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      {isLoading && invoices.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : invoices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="file-document-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Không có hoá đơn nào</Text>
          {isFiltersActive && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetFilters}
            >
              <Text style={styles.resetButtonText}>Xóa bộ lọc</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={item => item._id}
          renderItem={renderInvoiceItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={handleRefresh}
            />
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
                  Đã hiển thị {invoices.length} / {total} hoá đơn
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bộ lọc</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.filterForm}
              showsVerticalScrollIndicator={false}
            >
              {/* Filter by Employee */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  Lọc theo nhân viên
                </Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Nhập tên hoặc ID nhân viên"
                  placeholderTextColor="#999"
                  value={searchEmployee}
                  onChangeText={text => {
                    setSearchEmployee(text);
                    setFilters({ ...filters, employee_id: text });
                  }}
                />
                <Text style={styles.filterInputHint}>
                  {searchEmployee && `Sẽ lọc theo: ${searchEmployee}`}
                </Text>
              </View>

              {/* Filter by Customer */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>
                  Lọc theo khách hàng
                </Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Nhập tên hoặc SĐT khách hàng"
                  placeholderTextColor="#999"
                  value={searchCustomer}
                  onChangeText={text => {
                    setSearchCustomer(text);
                    setFilters({ ...filters, customer_id: text });
                  }}
                />
                <Text style={styles.filterInputHint}>
                  {searchCustomer && `Sẽ lọc theo: ${searchCustomer}`}
                </Text>
              </View>

              {/* Filter by Date Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Lọc theo ngày</Text>
                <Text style={styles.filterLabel}>Từ ngày (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="VD: 2024-01-01"
                  placeholderTextColor="#999"
                  value={filters.from_date}
                  onChangeText={text =>
                    setFilters({ ...filters, from_date: text })
                  }
                />

                <Text style={[styles.filterLabel, { marginTop: 12 }]}>
                  Đến ngày (YYYY-MM-DD)
                </Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="VD: 2024-12-31"
                  placeholderTextColor="#999"
                  value={filters.to_date}
                  onChangeText={text =>
                    setFilters({ ...filters, to_date: text })
                  }
                />
              </View>
            </ScrollView>

            {/* Modal Footer Buttons */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetModalButton}
                onPress={handleResetFilters}
              >
                <Text style={styles.resetModalButtonText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  filterButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0066CC',
  },
  filterButtonActive: {
    backgroundColor: '#0066CC',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  activeFiltersContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
    marginRight: 6,
  },
  listContent: {
    padding: 12,
    paddingBottom: 20,
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
    flex: 0.35,
  },
  value: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    flex: 0.65,
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
    marginTop: 12,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0066CC',
  },
  resetButtonText: {
    color: '#0066CC',
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
    paddingTop: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  filterForm: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  filterInputHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  resetModalButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#DDD',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  resetModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default BranchInvoiceHistoryScreen;
