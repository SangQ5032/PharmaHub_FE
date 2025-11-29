/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Employee Work History Detail Screen
 * Hiển thị chi tiết một bản ghi lịch sử làm việc
 * Nhận recordId từ list screen và gọi API để lấy dữ liệu chi tiết
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkScheduleHistoryRecord } from '@features/work-schdule/types/workScheduleHistory.types';
import { workScheduleApi } from '@features/work-schdule/api/work-schedule.api';
// import { ROUTES } from '@shared/constants/routes';

export const EmployeeWorkHistoryDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const navigation = useNavigation();

  // Nhận dữ liệu từ params (có thể là object hoặc ID)
  const recordFromParams = route.params?.record;
  const recordId = route.params?.recordId;

  // State để lưu dữ liệu detail từ API
  const [record, setRecord] = useState<WorkScheduleHistoryRecord | null>(
    recordFromParams || null,
  );
  const [loading, setLoading] = useState(!recordFromParams && !!recordId);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'invoices'>('info');

  // Gọi API để lấy chi tiết nếu có recordId
  useEffect(() => {
    if (recordId && !recordFromParams) {
      fetchRecordDetail();
    }
  }, [recordId, recordFromParams]);

  const fetchRecordDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!recordId) {
        setError('Không có recordId');
        return;
      }

      // Gọi API để lấy chi tiết attendance record với hoá đơn
      const response = await workScheduleApi.getWorkHistoryDetail(recordId);

      if (response.success && response.data) {
        setRecord(response.data as WorkScheduleHistoryRecord);
      } else {
        setError(response.message || 'Không tìm thấy bản ghi');
      }
    } catch (err) {
      setError(
        'Lỗi khi tải dữ liệu: ' +
          (err instanceof Error ? err.message : 'Unknown error'),
      );
      console.error('Error fetching record detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Đang tải...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !record) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={64}
            color={colors.notification}
          />
          <Text style={[styles.errorText, { color: colors.notification }]}>
            {error || 'Không tìm thấy dữ liệu'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (recordId) {
                fetchRecordDetail();
              } else {
                navigation.goBack();
              }
            }}
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.retryButtonText}>
              {recordId ? 'Thử lại' : 'Quay lại'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'checked_out':
        return 'Đã checkout';
      case 'checked_in':
        return 'Đang làm';
      case 'late':
        return 'Đi trễ';
      case 'early':
        return 'Về sớm';
      case 'absent':
        return 'Vắng mặt';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'checked_out':
        return 'check-circle';
      case 'checked_in':
        return 'clock-outline';
      case 'late':
        return 'alert-circle';
      case 'early':
        return 'check-clock';
      case 'absent':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'checked_out':
        return '#4CAF50';
      case 'checked_in':
        return '#2196F3';
      case 'late':
        return '#FF9800';
      case 'early':
        return '#9C27B0';
      case 'absent':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={[styles.section, { borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );

  const renderDetailRow = (label: string, value: string, icon?: string) => (
    <View style={styles.detailRow}>
      {icon && (
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      )}
      <View style={styles.detailContent}>
        <Text style={[styles.detailLabel, { color: colors.text }]}>
          {label}
        </Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Chi Tiết Lịch Làm Việc
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Tab Navigation */}
      <View
        style={[
          styles.tabContainer,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => setActiveTab('info')}
          style={[
            styles.tabButton,
            {
              borderBottomWidth: activeTab === 'info' ? 2 : 0,
              borderBottomColor: colors.primary,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={activeTab === 'info' ? colors.primary : colors.text}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'info' ? colors.primary : colors.text },
            ]}
          >
            Thông Tin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('invoices')}
          style={[
            styles.tabButton,
            {
              borderBottomWidth: activeTab === 'invoices' ? 2 : 0,
              borderBottomColor: colors.primary,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="file-document"
            size={20}
            color={activeTab === 'invoices' ? colors.primary : colors.text}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'invoices' ? colors.primary : colors.text,
              },
            ]}
          >
            Hoá Đơn ({record.invoiceCount || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'info' ? (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadgeLarge,
                { backgroundColor: getStatusColor(record.status) },
              ]}
            >
              <MaterialCommunityIcons
                name={getStatusIcon(record.status)}
                size={40}
                color="#fff"
              />
              <Text style={styles.statusLabelLarge}>
                {getStatusLabel(record.status)}
              </Text>
            </View>
          </View>

          {/* Date Section */}
          {renderSection(
            'Ngày Làm Việc',
            <View>
              {renderDetailRow('Ngày', formatDate(record.date), 'calendar')}
              {renderDetailRow(
                'Ca Làm',
                record.shift === 'morning' ? 'Ca sáng' : 'Ca chiều',
                record.shift === 'morning' ? 'weather-sunny' : 'weather-night',
              )}
            </View>,
          )}

          {/* Check-in/Check-out Section */}
          {renderSection(
            'Thời Gian Làm Việc',
            <View>
              {renderDetailRow(
                'Check-in',
                formatDateTime(record.checkin_time),
                'clock-in',
              )}
              {record.checkout_time &&
                renderDetailRow(
                  'Check-out',
                  formatDateTime(record.checkout_time),
                  'clock-out',
                )}
              {renderDetailRow(
                'Giờ Làm Việc',
                `${record.working_hours.toFixed(1)} giờ`,
                'timer',
              )}
            </View>,
          )}

          {/* Branch Section */}
          {renderSection(
            'Chi Nhánh',
            <View>
              {renderDetailRow(
                'Tên Chi Nhánh',
                record.branch_id.name,
                'office-building',
              )}
              {renderDetailRow(
                'Địa Chỉ',
                record.branch_id.address,
                'map-marker',
              )}
              {renderDetailRow('Điện Thoại', record.branch_id.phone, 'phone')}
            </View>,
          )}

          {/* Schedule Status Section */}
          {renderSection(
            'Trạng Thái Lịch',
            <View>
              {renderDetailRow(
                'Lịch Được Giao',
                record.isOnSchedule ? 'Có' : 'Không',
                record.isOnSchedule ? 'check-circle' : 'close-circle',
              )}
              {record.scheduledShift &&
                renderDetailRow(
                  'Ca Được Giao',
                  record.scheduledShift.shift === 'morning'
                    ? 'Ca sáng'
                    : 'Ca chiều',
                  'calendar-clock',
                )}
            </View>,
          )}

          {/* Invoice Summary Section */}
          {record.invoiceSummary &&
            renderSection(
              'Tổng Hợp Hoá Đơn',
              <View>
                {renderDetailRow(
                  'Số Hoá Đơn',
                  `${record.invoiceCount || 0}`,
                  'file-document',
                )}
                {renderDetailRow(
                  'Tổng Tiền',
                  `${(record.invoiceSummary.totalAmount || 0).toLocaleString(
                    'vi-VN',
                  )} đ`,
                  'cash',
                )}
                {renderDetailRow(
                  'Tổng Sản Phẩm',
                  `${record.invoiceSummary.totalItems || 0}`,
                  'package-variant',
                )}
              </View>,
            )}

          {/* ID Section */}
          {renderSection(
            'Mã Định Danh',
            <View>
              <View style={styles.idRow}>
                <Text style={[styles.idLabel, { color: colors.text }]}>
                  Record ID
                </Text>
                <TouchableOpacity>
                  <Text
                    style={[styles.idValue, { color: colors.primary }]}
                    numberOfLines={1}
                  >
                    {record._id}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>,
          )}
        </ScrollView>
      ) : (
        <View style={styles.invoicesContainer}>
          {record.invoices && record.invoices.length > 0 ? (
            <FlatList
              data={record.invoices}
              keyExtractor={(item, index) => item._id || `invoice-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item._id) {
                      (navigation as any).navigate('InvoiceDetail', {
                        invoiceId: item._id,
                      });
                    }
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.invoiceCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.invoiceHeader}>
                    <Text style={[styles.invoiceCode, { color: colors.text }]}>
                      {item.invoice_code || 'N/A'}
                    </Text>
                    <Text style={[styles.invoiceStatus, { color: '#4CAF50' }]}>
                      {item.status === 'completed' ? 'Hoàn tất' : 'Đang xử lý'}
                    </Text>
                  </View>

                  <View style={styles.invoiceDetails}>
                    <View style={styles.detailRow}>
                      <Text
                        style={[styles.detailLabel, { color: colors.text }]}
                      >
                        Khách hàng:
                      </Text>
                      <Text
                        style={[styles.detailValue, { color: colors.text }]}
                      >
                        {item.customer_name || item.customer_id?.name || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text
                        style={[styles.detailLabel, { color: colors.text }]}
                      >
                        Tổng tiền:
                      </Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: colors.text, fontWeight: '700' },
                        ]}
                      >
                        {(item.total_amount || 0).toLocaleString('vi-VN')} đ
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text
                        style={[styles.detailLabel, { color: colors.text }]}
                      >
                        Số sản phẩm:
                      </Text>
                      <Text
                        style={[styles.detailValue, { color: colors.text }]}
                      >
                        {item.items?.length || 0}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text
                        style={[styles.detailLabel, { color: colors.text }]}
                      >
                        Ngày tạo:
                      </Text>
                      <Text
                        style={[styles.detailValue, { color: colors.text }]}
                      >
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString('vi-VN')
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.invoicesList}
            />
          ) : (
            <View style={styles.emptyInvoices}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={64}
                color={colors.primary}
              />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Không có hoá đơn
              </Text>
              <Text style={[styles.emptySubText, { color: colors.text }]}>
                Không có hoá đơn được tạo trong ca này
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  invoicesContainer: {
    flex: 1,
  },
  invoicesList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  invoiceCard: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  invoiceCode: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  invoiceStatus: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  invoiceDetails: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    flex: 0.4,
  },
  detailValue: {
    fontSize: 12,
    flex: 0.6,
    textAlign: 'right',
  },
  emptyInvoices: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    marginTop: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadgeLarge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  statusLabelLarge: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
    borderLeftWidth: 4,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  detailContent: {
    flex: 1,
  },
  noteContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  idLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  idValue: {
    fontSize: 12,
    maxWidth: '60%',
  },
});
