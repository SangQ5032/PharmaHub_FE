import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetInvoiceById } from '../hooks/useSales';
import { Invoice } from '../types';

const InvoiceDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const invoiceId = route.params?.invoiceId;

  const { data: invoiceData, isLoading, error } = useGetInvoiceById(invoiceId);
  const invoice: Invoice = invoiceData?.data;

  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', 'Không thể tải chi tiết hóa đơn');
      navigation.goBack();
    }
  }, [error, navigation]);

  const handleShare = async () => {
    try {
      if (invoice) {
        const message = `
Hóa Đơn: ${invoice.invoice_code}
Khách hàng: ${invoice.customer_name}
Số điện thoại: ${invoice.customer_phone}
Tổng cộng: ${invoice.total_amount?.toLocaleString('vi-VN')}₫
        `;
        await Share.share({
          message,
          title: `Hóa Đơn ${invoice.invoice_code}`,
        });
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể chia sẻ hóa đơn');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang tải chi tiết hóa đơn...</Text>
        </View>
      </View>
    );
  }

  if (!invoice) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy hóa đơn</Text>
        </View>
      </View>
    );
  }

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View style={styles.invoiceCodeContainer}>
              <Text style={styles.invoiceCode}>{invoice.invoice_code}</Text>
              <Text style={styles.invoiceDate}>
                {new Date(invoice.createdAt).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
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
        </View>

        {/* Branch Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cửa hàng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên cửa hàng:</Text>
            <Text style={styles.value}>{invoice.branch_id?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.value}>{invoice.branch_id?.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{invoice.branch_id?.phone}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{invoice.customer_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{invoice.customer_phone}</Text>
          </View>
          {invoice.customer_id?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ:</Text>
              <Text style={styles.value}>{invoice.customer_id.address}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tổng chi tiêu:</Text>
            <Text style={styles.value}>
              {invoice.customer_id?.total_spent?.toLocaleString('vi-VN')}₫
            </Text>
          </View>
        </View>

        {/* Employee Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhân viên bán hàng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{invoice.employee_id?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{invoice.employee_id?.username}</Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm bán</Text>
          {invoice.items?.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>{item.medicine_id?.unit}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Lô hàng:</Text>
                <Text style={styles.itemValue}>{item.batch_number}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Ngày hết hạn:</Text>
                <Text style={styles.itemValue}>
                  {new Date(item.batch_id?.expiry_date).toLocaleDateString(
                    'vi-VN',
                  )}
                </Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Số lượng:</Text>
                <Text style={styles.itemValue}>{item.quantity}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>Giá bán:</Text>
                <Text style={styles.itemValue}>
                  {item.unit_price?.toLocaleString('vi-VN')}₫
                </Text>
              </View>
              <View style={[styles.itemRow, styles.itemTotal]}>
                <Text style={styles.itemLabel}>Thành tiền:</Text>
                <Text style={styles.itemTotalValue}>
                  {item.line_total?.toLocaleString('vi-VN')}₫
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tổng tiền hàng:</Text>
            <Text style={styles.value}>
              {invoice.subtotal?.toLocaleString('vi-VN')}₫
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Chiết khấu:</Text>
            <Text style={styles.value}>
              -{invoice.discount?.toLocaleString('vi-VN')}₫
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Thuế ({invoice.tax_rate}%):</Text>
            <Text style={styles.value}>
              {invoice.tax_amount?.toLocaleString('vi-VN')}₫
            </Text>
          </View>
          <View style={[styles.infoRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>
              {invoice.total_amount?.toLocaleString('vi-VN')}₫
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.paymentMethodBadge}>
            <Text style={styles.paymentMethodText}>
              {invoice.payment_method === 'cash'
                ? '💵 Tiền mặt'
                : invoice.payment_method === 'card'
                ? '💳 Thẻ'
                : '🔄 Chuyển khoản'}
            </Text>
          </View>
        </View>

        {/* Note */}
        {invoice.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <Text style={styles.noteText}>{invoice.note}</Text>
          </View>
        )}

        {/* Timestamps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tạo lúc:</Text>
            <Text style={styles.value}>
              {new Date(invoice.createdAt).toLocaleString('vi-VN')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cập nhật lúc:</Text>
            <Text style={styles.value}>
              {new Date(invoice.updatedAt).toLocaleString('vi-VN')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
        >
          <Text style={styles.actionButtonText}>Chia sẻ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.closeButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceCodeContainer: {
    flex: 1,
  },
  invoiceCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    color: '#666',
    flex: 0.45,
  },
  value: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 0.55,
    textAlign: 'right',
  },
  totalRow: {
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066CC',
  },
  itemCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  itemUnit: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 12,
    color: '#666',
  },
  itemValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  itemTotal: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  itemTotalValue: {
    fontSize: 13,
    color: '#0066CC',
    fontWeight: '700',
  },
  paymentMethodBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#E3F2FD',
  },
  closeButton: {
    backgroundColor: '#0066CC',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default InvoiceDetailScreen;
