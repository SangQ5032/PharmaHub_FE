import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useGetCustomerById,
  useGetCustomerInvoices,
} from '../hooks/useCustomers';
import { Invoice } from '../api/customers.api';

interface CustomerDetailScreenProps {
  route: {
    params: {
      customerId: string;
    };
  };
  navigation?: any;
}

type TabType = 'info' | 'invoices';

const CustomerDetailScreen: React.FC<CustomerDetailScreenProps> = ({
  route,
  navigation: _navigation,
}) => {
  const customerId = route.params?.customerId;
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: customerResponse,
    isLoading: isLoadingCustomer,
    refetch: refetchCustomer,
  } = useGetCustomerById(customerId);
  const {
    data: invoicesResponse,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices,
  } = useGetCustomerInvoices(customerId);

  const customer = useMemo(
    () => customerResponse?.data,
    [customerResponse?.data],
  );
  const invoices = useMemo(
    () => invoicesResponse?.data || [],
    [invoicesResponse?.data],
  );

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchCustomer(), refetchInvoices()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchCustomer, refetchInvoices]);

  if (isLoadingCustomer) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải thông tin khách hàng...</Text>
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={64} color="#ff9800" />
        <Text style={styles.errorText}>Không tìm thấy khách hàng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.customerIconContainer}>
          <Icon name="account-circle" size={60} color="#4CAF50" />
        </View>
        <View style={styles.customerHeaderInfo}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerPhone}>
            <Icon name="phone" size={14} color="#666" /> {customer.phone}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Icon
            name="information"
            size={20}
            color={activeTab === 'info' ? '#4CAF50' : '#999'}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'info' && styles.activeTabText,
            ]}
          >
            Thông tin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'invoices' && styles.activeTab]}
          onPress={() => setActiveTab('invoices')}
        >
          <Icon
            name="receipt"
            size={20}
            color={activeTab === 'invoices' ? '#4CAF50' : '#999'}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'invoices' && styles.activeTabText,
            ]}
          >
            Đơn hàng ({invoices.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
          />
        }
      >
        {activeTab === 'info' && (
          <View style={styles.infoContainer}>
            <InfoTab customer={customer} />
          </View>
        )}

        {activeTab === 'invoices' && (
          <View style={styles.invoicesContainer}>
            <InvoicesTab invoices={invoices} isLoading={isLoadingInvoices} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Info Tab Component
const InfoTab: React.FC<{ customer: any }> = ({ customer }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const infoItems = [
    {
      icon: 'phone',
      label: 'Số điện thoại',
      value: customer.phone,
    },
    {
      icon: 'map-marker',
      label: 'Địa chỉ',
      value: customer.address || 'Không cập nhật',
    },
    {
      icon: 'email',
      label: 'Email',
      value: customer.email || 'Không cập nhật',
    },
    {
      icon: 'cash-multiple',
      label: 'Tổng chi tiêu',
      value: `${customer.total_spent?.toLocaleString('vi-VN')} đ`,
      highlight: true,
    },
    {
      icon: 'calendar',
      label: 'Ngày tạo',
      value: customer.createdAt ? formatDate(customer.createdAt) : 'N/A',
    },
    {
      icon: 'update',
      label: 'Cập nhật lần cuối',
      value: customer.updatedAt ? formatDate(customer.updatedAt) : 'N/A',
    },
  ];

  return (
    <View style={styles.infoContent}>
      {infoItems.map((item, index) => (
        <View key={index} style={styles.infoItem}>
          <View style={styles.infoItemLeft}>
            <Icon name={item.icon} size={20} color="#4CAF50" />
            <Text style={styles.infoLabel}>{item.label}</Text>
          </View>
          <Text
            style={[
              styles.infoValue,
              item.highlight && styles.infoValueHighlight,
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

// Invoices Tab Component
const InvoicesTab: React.FC<{ invoices: Invoice[]; isLoading: boolean }> = ({
  invoices,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải danh sách đơn hàng...</Text>
      </View>
    );
  }

  if (invoices.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="receipt-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Không có đơn hàng</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={invoices}
      keyExtractor={item => item._id}
      renderItem={({ item }) => <InvoiceItem invoice={item} />}
      scrollEnabled={false}
      contentContainerStyle={styles.invoicesList}
    />
  );
};

// Invoice Item Component
const InvoiceItem: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Tiền mặt',
      card: 'Thẻ',
      bank: 'Ngân hàng',
      'e-wallet': 'Ví điện tử',
    };
    return labels[method] || method;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: '#4CAF50',
      pending: '#ff9800',
      cancelled: '#f44336',
    };
    return colors[status] || '#999';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      cancelled: 'Đã hủy',
    };
    return labels[status] || status;
  };

  return (
    <View style={styles.invoiceCard}>
      {/* Header */}
      <View style={styles.invoiceHeader}>
        <View>
          <Text style={styles.invoiceCode}>{invoice.invoice_code}</Text>
          <Text style={styles.invoiceDate}>
            {formatDate(invoice.createdAt)}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(invoice.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusLabel(invoice.status)}
          </Text>
        </View>
      </View>

      {/* Branch & Employee */}
      <View style={styles.invoiceDetails}>
        <View style={styles.detailRow}>
          <Icon name="office-building" size={16} color="#666" />
          <Text style={styles.detailText}>{invoice.branch_id.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="account" size={16} color="#666" />
          <Text style={styles.detailText}>{invoice.employee_id.name}</Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsLabel}>Sản phẩm:</Text>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemBatch}>Lô: {item.batch_number}</Text>
              <Text style={styles.itemQuantity}>
                SL: {item.quantity} {item.unit}
              </Text>
            </View>
            <Text style={styles.itemPrice}>
              {item.line_total.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        ))}
      </View>

      {/* Payment Info */}
      <View style={styles.paymentContainer}>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Phương thức:</Text>
          <Text style={styles.paymentValue}>
            {getPaymentMethodLabel(invoice.payment_method)}
          </Text>
        </View>
        {invoice.discount > 0 && (
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Giảm giá:</Text>
            <Text style={styles.paymentValue}>
              {invoice.discount.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        )}
        {invoice.tax_amount > 0 && (
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Thuế:</Text>
            <Text style={styles.paymentValue}>
              {invoice.tax_amount.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        )}
        <View style={[styles.paymentRow, styles.paymentRowTotal]}>
          <Text style={styles.paymentLabelTotal}>Tổng cộng:</Text>
          <Text style={styles.paymentValueTotal}>
            {invoice.total_amount.toLocaleString('vi-VN')} đ
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ff9800',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  customerIconContainer: {
    marginRight: 16,
  },
  customerHeaderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
  },
  infoContent: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
  },
  infoValueHighlight: {
    color: '#4CAF50',
    fontSize: 15,
  },
  invoicesContainer: {
    flex: 1,
  },
  invoicesList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  invoiceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  invoiceCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  invoiceDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  invoiceDetails: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  itemsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  itemBatch: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
  paymentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentRowTotal: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  paymentLabel: {
    fontSize: 13,
    color: '#666',
  },
  paymentValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  paymentLabelTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  paymentValueTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4CAF50',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});

export default CustomerDetailScreen;
