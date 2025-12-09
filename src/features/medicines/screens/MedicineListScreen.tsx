import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useMedicines } from '../hooks/useMedicines';
import MedicineItem from '../components/MedicineItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { importMedicines } from '../services/medicineService';
import { pick } from '@react-native-documents/picker';

const MedicineListScreen: React.FC = () => {
  const { medicines, loading, error, refresh, search, setSearch } =
    useMedicines();
  const navigation = useNavigation<any>();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  // Filter medicines by search query
  const filteredMedicines = useMemo(() => {
    if (!search.trim()) {
      return medicines;
    }
    const query = search.toLowerCase().trim();
    return medicines.filter(m => {
      const nameMatch = m.name?.toLowerCase().includes(query);
      const descMatch = m.description?.toLowerCase().includes(query);
      const manufacturerMatch = m.manufacturer?.toLowerCase().includes(query);
      return nameMatch || descMatch || manufacturerMatch;
    });
  }, [medicines, search]);

  // Handle import Excel file
  const handleImportExcel = async () => {
    try {
      // Chọn file Excel
      const result = await pick({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv',
        ],
        allowMultiSelection: false,
      });

      console.log('[MedicineListScreen] Document picker result:', result);

      if (result && result.length > 0) {
        const file = result[0];

        console.log('[MedicineListScreen] Selected file:', {
          uri: file.uri,
          name: file.name,
          type: file.type,
          size: file.size,
        });

        // Kiểm tra định dạng file
        const fileName = file.name || '';
        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const isValidFile = validExtensions.some(ext =>
          fileName.toLowerCase().endsWith(ext),
        );

        if (!isValidFile) {
          Alert.alert(
            'Lỗi',
            'Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV (.csv)',
          );
          return;
        }

        // Xác định MIME type dựa trên extension nếu không có
        let mimeType = file.type;
        if (!mimeType) {
          if (fileName.toLowerCase().endsWith('.xlsx')) {
            mimeType =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          } else if (fileName.toLowerCase().endsWith('.xls')) {
            mimeType = 'application/vnd.ms-excel';
          } else if (fileName.toLowerCase().endsWith('.csv')) {
            mimeType = 'text/csv';
          } else {
            mimeType =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          }
        }

        setImporting(true);
        setShowImportModal(true);

        // Gọi API import
        const response = await importMedicines(
          file.uri,
          file.name || 'import.xlsx',
          mimeType,
        );

        setImportResult(response);

        // Nếu thành công, refresh danh sách thuốc
        if (response.success) {
          refresh();
        }
      }
    } catch (err: any) {
      // User cancelled the picker
      if (
        err?.code === 'DOCUMENT_PICKER_CANCELED' ||
        err?.message?.includes('cancel')
      ) {
        return;
      }

      console.error('Import error:', err);
      Alert.alert(
        'Lỗi',
        err?.message || 'Không thể import file. Vui lòng thử lại.',
      );
      setShowImportModal(false);
    } finally {
      setImporting(false);
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportResult(null);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Quản lý thuốc</Text>
        </View>

        {/* Search box */}
        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm theo tên, mô tả hoặc nhà sản xuất..."
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={[styles.headerCell, { flex: 35 }]}>
            <Text style={[styles.headerText, styles.left]}>TÊN THUỐC</Text>
          </View>
          <View style={[styles.headerCell, { flex: 20 }]}>
            <Text style={[styles.headerText, styles.center]}>NHÀ SẢN XUẤT</Text>
          </View>
          <View style={[styles.headerCell, { flex: 15 }]}>
            <Text style={[styles.headerText, styles.center]}>ĐƠN VỊ</Text>
          </View>
          <View style={[styles.headerCell, { flex: 15 }]}>
            <Text style={[styles.headerText, styles.center]}>GIÁ</Text>
          </View>
          <View style={[styles.headerCell, { flex: 15 }]}>
            <Text style={[styles.headerText, styles.center]}>TRẠNG THÁI</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>Lỗi: {String(error)}</Text>
            <TouchableOpacity style={styles.retry} onPress={refresh}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <FlatList
          data={filteredMedicines}
          keyExtractor={item => String(item._id)}
          renderItem={({ item }) => (
            <MedicineItem item={item} onUpdated={refresh} />
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
          contentContainerStyle={
            filteredMedicines.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>Không có dữ liệu</Text>
            ) : null
          }
        />

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.pillButton, styles.importButton]}
            onPress={handleImportExcel}
            activeOpacity={0.8}
            disabled={importing}
          >
            <Text style={styles.pillButtonText}>
              {importing ? 'Đang import...' : '📥 Import Excel'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pillButton}
            onPress={() => navigation.navigate(ROUTES.ADD_MEDICINE)}
            activeOpacity={0.8}
          >
            <Text style={styles.pillButtonText}>＋ Thêm thuốc</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Import Result Modal */}
      <Modal
        visible={showImportModal}
        transparent
        animationType="slide"
        onRequestClose={closeImportModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kết quả import</Text>
              <TouchableOpacity onPress={closeImportModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {importing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2EB872" />
                <Text style={styles.loadingText}>Đang xử lý file...</Text>
              </View>
            ) : importResult ? (
              <ScrollView style={styles.resultContainer}>
                <View
                  style={[
                    styles.resultStatus,
                    importResult.success
                      ? styles.resultSuccess
                      : styles.resultError,
                  ]}
                >
                  <Text
                    style={[
                      styles.resultStatusText,
                      importResult.success
                        ? styles.resultSuccessText
                        : styles.resultErrorText,
                    ]}
                  >
                    {importResult.success ? '✓ Thành công' : '✗ Thất bại'}
                  </Text>
                </View>

                <Text style={styles.resultMessage}>
                  {typeof importResult.message === 'string'
                    ? importResult.message
                    : String(importResult.message || 'Hoàn thành')}
                </Text>

                {importResult.data && (
                  <View style={styles.resultStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Tổng số:</Text>
                      <Text style={styles.statValue}>
                        {importResult.data.total || 0}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Thành công:</Text>
                      <Text style={[styles.statValue, styles.statSuccess]}>
                        {importResult.data.success || 0}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Thất bại:</Text>
                      <Text style={[styles.statValue, styles.statError]}>
                        {importResult.data.failed || 0}
                      </Text>
                    </View>
                  </View>
                )}

                {importResult.data?.errors &&
                  importResult.data.errors.length > 0 && (
                    <View style={styles.errorsContainer}>
                      <Text style={styles.errorsTitle}>Chi tiết lỗi:</Text>
                      {importResult.data.errors.map(
                        (error: any, index: number) => (
                          <View key={index} style={styles.errorItem}>
                            <Text style={styles.errorText}>
                              Dòng {error.row}:{' '}
                              {typeof error.message === 'string'
                                ? error.message
                                : String(error.message || 'Lỗi không xác định')}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>
                  )}

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={closeImportModal}
                >
                  <Text style={styles.modalButtonText}>Đóng</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titleContainer: {
    height: 56,
    backgroundColor: '#2EB872',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: { fontSize: 20, fontWeight: '600', color: '#fff' },

  // search
  searchContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },

  headerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 6,
    alignItems: 'center',
  },
  headerCell: {
    paddingHorizontal: 6,
    minWidth: 0,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },

  bottomBar: {
    padding: 12,
    gap: 8,
  },
  pillButton: {
    width: '100%',
    backgroundColor: '#2EB872',
    paddingVertical: 12,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  importButton: {
    backgroundColor: '#2196F3',
  },
  pillButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  error: { color: 'red', marginBottom: 8 },
  errorContainer: { marginBottom: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#666', padding: 20 },
  // retry button (error)
  retry: {
    alignSelf: 'flex-start',
    backgroundColor: '#2EB872',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '700' },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  modalClose: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  resultContainer: {
    maxHeight: 400,
  },
  resultStatus: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  resultSuccess: {
    backgroundColor: '#E8F5E9',
  },
  resultError: {
    backgroundColor: '#FFEBEE',
  },
  resultStatusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultSuccessText: {
    color: '#2E7D32',
  },
  resultErrorText: {
    color: '#C62828',
  },
  resultMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statSuccess: {
    color: '#2E7D32',
  },
  statError: {
    color: '#C62828',
  },
  errorsContainer: {
    marginBottom: 16,
  },
  errorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorItem: {
    padding: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#E65100',
  },
  modalButton: {
    backgroundColor: '#2EB872',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default MedicineListScreen;
