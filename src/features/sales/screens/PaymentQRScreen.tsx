import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { useCreateInvoice } from '../hooks/useSales';

const PaymentQRScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { invoiceData, total } = route.params || {};
  const { mutate: createInvoiceMutation, isPending: isProcessing } =
    useCreateInvoice();

  // Bank account details (set sẵn)
  const bankDetails = {
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountHolder: 'Công ty Dược Pharma Hub',
    branch: 'TP. Hồ Chí Minh',
  };

  // Generate VietQR format for QR code
  const qrValue = `00020126360014vn.com.vietqr011864${bankDetails.accountNumber}0712Pharma Hub5204291953033565402680006130000000000000000630480A63047EBD`;

  const handlePaymentConfirm = () => {
    createInvoiceMutation(invoiceData, {
      onSuccess: (response: any) => {
        Alert.alert(
          'Thành công',
          `Tạo hóa đơn thành công!\nMã hóa đơn: ${response.data.invoice_code}`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Sales');
              },
            },
          ],
        );
      },
      onError: (error: any) => {
        Alert.alert(
          'Lỗi',
          error?.response?.data?.message || 'Tạo hóa đơn thất bại',
        );
      },
    });
  };

  if (!invoiceData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Dữ liệu không hợp lệ</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Thanh toán qua chuyển khoản</Text>

        {/* Amount */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Số tiền cần thanh toán:</Text>
          <Text style={styles.amountValue}>
            {total.toLocaleString('vi-VN')}₫
          </Text>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>Quét mã QR để thanh toán</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={200}
              color="black"
              backgroundColor="white"
              quietZone={10}
            />
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.bankSection}>
          <Text style={styles.bankTitle}>Thông tin tài khoản ngân hàng:</Text>

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Ngân hàng:</Text>
            <Text style={styles.bankDetailValue}>{bankDetails.bankName}</Text>
          </View>

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Chủ tài khoản:</Text>
            <Text style={styles.bankDetailValue}>
              {bankDetails.accountHolder}
            </Text>
          </View>

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Số tài khoản:</Text>
            <Text style={styles.bankDetailValue}>
              {bankDetails.accountNumber}
            </Text>
          </View>

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Chi nhánh:</Text>
            <Text style={styles.bankDetailValue}>{bankDetails.branch}</Text>
          </View>

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Nội dung chuyển khoản:</Text>
            <Text style={styles.bankDetailValue}>Invoice Payment</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isProcessing}
          >
            <Text style={styles.cancelButtonText}>Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              isProcessing && styles.confirmButtonDisabled,
            ]}
            onPress={handlePaymentConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.confirmButtonText}>
                Xác nhận đã thanh toán
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  amountSection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0066CC',
  },
  qrSection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  qrLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  qrContainer: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFF',
  },
  bankSection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bankDetailLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  bankDetailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#00AA44',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PaymentQRScreen;
