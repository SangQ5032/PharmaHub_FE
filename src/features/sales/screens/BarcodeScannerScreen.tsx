import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import { useScanBarcode } from '../hooks/useSales';

const BarcodeScannerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { mutate: scanBarcodeMutation, isPending } = useScanBarcode();

  // ✅ VisionCamera hooks
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [manualBarcode, setManualBarcode] = useState('');
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');
  const barcodeInputRef = useRef<TextInput>(null);
  const cameraRef = useRef<Camera>(null);

  // ✅ Request camera permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const processBarcodeDetection = (barcode: string) => {
    // Call API to scan barcode
    scanBarcodeMutation(barcode, {
      onSuccess: response => {
        const { medicine, batches } = response.data;

        Alert.alert('Scan thành công', `Tìm thấy thuốc: ${medicine.name}`, [
          {
            text: 'Hủy',
            onPress: () => {
              setManualBarcode('');
            },
            style: 'cancel',
          },
          {
            text: 'Tiếp tục',
            onPress: () => {
              // Navigate to medicine detail screen
              navigation.navigate('SalesMedicineDetail', {
                medicine,
                batches, // ✅ Pass batches từ scan response
                fromBarcodeScan: true, // ✅ Flag để biết đã scan barcode
                onAddMedicine: (
                  selectedMedicine: any,
                  quantity: number,
                  price: number,
                  batchId: string,
                ) => {
                  // Return back to CreateInvoiceScreen with selected item
                  navigation.navigate('CreateInvoice', {
                    newItem: {
                      medicine_id: selectedMedicine._id,
                      batch_id: batchId,
                      quantity,
                      unit_price: price,
                    },
                  });
                },
              });
            },
          },
        ]);
      },
      onError: (error: any) => {
        Alert.alert(
          'Lỗi',
          error?.response?.data?.message ||
            'Không tìm thấy thuốc với barcode này',
          [
            {
              text: 'Thử lại',
              onPress: () => {
                setManualBarcode('');
              },
            },
          ],
        );
      },
    });
  };

  const handleManualBarcodeSubmit = () => {
    if (!manualBarcode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã barcode');
      return;
    }

    processBarcodeDetection(manualBarcode.trim());
    setManualBarcode('');
  };

  const handleBarcodeInputChange = (text: string) => {
    setManualBarcode(text);
    // Auto-submit when barcode format detected (usually ends with Enter)
    if (text.endsWith('\n')) {
      const cleanBarcode = text.trim();
      if (cleanBarcode) {
        processBarcodeDetection(cleanBarcode);
        setManualBarcode('');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Mode Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            scanMode === 'camera' && styles.tabButtonActive,
          ]}
          onPress={() => setScanMode('camera')}
        >
          <Text
            style={[
              styles.tabButtonText,
              scanMode === 'camera' && styles.tabButtonTextActive,
            ]}
          >
            📷 Quét Mã Vạch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            scanMode === 'manual' && styles.tabButtonActive,
          ]}
          onPress={() => setScanMode('manual')}
        >
          <Text
            style={[
              styles.tabButtonText,
              scanMode === 'manual' && styles.tabButtonTextActive,
            ]}
          >
            ⌨️ Nhập Thủ Công
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camera Mode */}
      {scanMode === 'camera' ? (
        hasPermission ? (
          device ? (
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={scanMode === 'camera'}
              >
                {/* Camera Frame Overlay */}
                <View style={styles.cameraOverlay}>
                  <View style={styles.scannerFrame} />
                  <Text style={styles.scannerText}>📱 Quét mã vạch</Text>
                  <Text style={styles.scannerSubtext}>
                    Hoặc chuyển sang chế độ nhập thủ công
                  </Text>
                </View>

                {/* Loading indicator */}
                {isPending && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#00AA44" />
                    <Text style={styles.loadingText}>Đang xử lý...</Text>
                  </View>
                )}
              </Camera>
            </View>
          ) : (
            <View style={styles.noPermissionContainer}>
              <Text style={styles.noPermissionTitle}>
                ❌ Không Tìm Thấy Camera
              </Text>
              <Text style={styles.noPermissionText}>
                Thiết bị của bạn không có camera, vui lòng nhập barcode thủ công
              </Text>
              <TouchableOpacity
                style={styles.switchModeButton}
                onPress={() => setScanMode('manual')}
              >
                <Text style={styles.switchModeButtonText}>Nhập Thủ Công</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          // ✅ No permission state
          <View style={styles.noPermissionContainer}>
            <Text style={styles.noPermissionTitle}>
              ❌ Không Có Quyền Camera
            </Text>
            <Text style={styles.noPermissionText}>
              Vui lòng cấp quyền camera trong cài đặt ứng dụng để sử dụng chức
              năng quét mã vạch
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => requestPermission()}
            >
              <Text style={styles.retryButtonText}>Thử Lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.switchModeButton}
              onPress={() => setScanMode('manual')}
            >
              <Text style={styles.switchModeButtonText}>
                Nhập Thủ Công Thay Thế
              </Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        /* Manual Mode */
        <View style={styles.content}>
          {/* Instruction */}
          <View style={styles.instructionSection}>
            <Text style={styles.instructionTitle}>⌨️ Nhập Barcode</Text>
            <Text style={styles.instructionText}>
              Vui lòng nhập mã vạch thuốc
            </Text>
          </View>

          {/* Input field for barcode */}
          <View style={styles.inputSection}>
            <TextInput
              ref={barcodeInputRef}
              style={styles.barcodeInput}
              placeholder="Nhập mã barcode..."
              value={manualBarcode}
              onChangeText={handleBarcodeInputChange}
              editable={!isPending}
              autoFocus
              placeholderTextColor="#999"
              returnKeyType="send"
              onSubmitEditing={handleManualBarcodeSubmit}
            />
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isPending || !manualBarcode.trim()) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleManualBarcodeSubmit}
            disabled={isPending || !manualBarcode.trim()}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Xác nhận</Text>
            )}
          </TouchableOpacity>

          {/* Info section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>💡 Cách sử dụng:</Text>
            <Text style={styles.infoText}>
              1. Nhập mã barcode vào trường bên trên
            </Text>
            <Text style={styles.infoText}>2. Nhấn "Xác nhận"</Text>
            <Text style={styles.infoText}>
              3. Chọn lô (batch) và số lượng để thêm vào hoá đơn
            </Text>
          </View>
        </View>
      )}

      {/* Close button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // ✅ Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#0066CC',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabButtonTextActive: {
    color: '#0066CC',
  },
  // ✅ Camera styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#00AA44',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 170, 68, 0.1)',
  },
  scannerText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  scannerSubtext: {
    marginTop: 8,
    fontSize: 13,
    color: '#CCC',
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  instructionSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  barcodeInput: {
    borderWidth: 2,
    borderColor: '#0066CC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#00AA44',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoSection: {
    backgroundColor: '#E7F3FF',
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
    borderRadius: 8,
    padding: 16,
    marginTop: 30,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066CC',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#F0F0F0',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066CC',
  },
  // ✅ Permission denied state styles
  noPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  noPermissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC3545',
    marginBottom: 12,
    textAlign: 'center',
  },
  noPermissionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 12,
    minWidth: 200,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    backgroundColor: '#6C757D',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 200,
  },
  switchModeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BarcodeScannerScreen;
