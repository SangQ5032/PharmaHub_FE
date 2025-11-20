// src/features/warehouse/screens/ReportViewScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ReportSummaryCard } from '@features/warehouse/components/ReportSummaryCard';
import { InventoryCard } from '@features/warehouse/components/InventoryCard';
import {
  useGenerateReport,
  useExportReport,
} from '@features/warehouse/hooks/useReports';
import {
  ReportType,
  ReportFormat,
  ReportFilter,
  ReportData,
} from '@features/warehouse/types/report.types';

interface RouteParams {
  type: ReportType;
  format: ReportFormat;
  filter: ReportFilter;
  title: string;
}

export default function ReportViewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as RouteParams;

  // State
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>(
    params.format || 'pdf',
  );

  // Hooks
  const generateReportMutation = useGenerateReport();
  const exportReportMutation = useExportReport();

  // Load report data
  const loadReportData = useCallback(async () => {
    try {
      const result = await generateReportMutation.mutateAsync({
        type: params.type,
        format: params.format,
        ...params.filter,
      });

      if (result.success && result.data) {
        setReportData(result.data);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tạo báo cáo');
    }
  }, [generateReportMutation, params]);

  // Load report data on mount
  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  // Handle export
  const handleExport = async () => {
    try {
      const result = await exportReportMutation.mutateAsync({
        type: params.type,
        format: selectedFormat,
        ...params.filter,
      });

      if (result.success) {
        Alert.alert(
          'Thành công',
          `Đã xuất báo cáo ${selectedFormat.toUpperCase()} thành công!`,
          [{ text: 'OK' }],
        );
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể xuất báo cáo');
    }
  };

  // Render loading
  if (generateReportMutation.isPending || !reportData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tạo báo cáo...</Text>
      </View>
    );
  }

  // Get report icon and color
  const getReportStyle = () => {
    switch (params.type) {
      case 'inventory':
        return { icon: '📦', color: '#2196F3' };
      case 'low_stock':
        return { icon: '⚠️', color: '#FF9800' };
      case 'out_of_stock':
        return { icon: '🚫', color: '#F44336' };
      case 'expiring':
        return { icon: '⏰', color: '#9C27B0' };
      default:
        return { icon: '📊', color: '#4CAF50' };
    }
  };

  const reportStyle = getReportStyle();

  // Prepare summary items
  const summaryItems = [
    {
      label: 'Tổng số mặt hàng',
      value: reportData.summary.total_items,
      icon: '📦',
      color: '#2196F3',
    },
    {
      label: 'Tổng số thuốc',
      value: reportData.summary.total_medicines,
      icon: '💊',
      color: '#4CAF50',
    },
    {
      label: 'Tổng giá trị',
      value: `${reportData.summary.total_value.toLocaleString('vi-VN')} ₫`,
      icon: '💰',
      color: '#FF9800',
    },
    {
      label: 'Sắp hết hàng',
      value: reportData.summary.low_stock_count,
      icon: '⚠️',
      color: '#FF9800',
    },
    {
      label: 'Hết hàng',
      value: reportData.summary.out_of_stock_count,
      icon: '🚫',
      color: '#F44336',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: reportStyle.color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{reportStyle.icon}</Text>
          <Text style={styles.headerTitle}>{params.title}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Report Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{reportData.title}</Text>
          {reportData.description && (
            <Text style={styles.infoDescription}>{reportData.description}</Text>
          )}
          {reportData.branch && (
            <Text style={styles.infoBranch}>
              Chi nhánh: {reportData.branch.name}
            </Text>
          )}
          <Text style={styles.infoDate}>
            Ngày tạo:{' '}
            {new Date(reportData.created_at).toLocaleDateString('vi-VN')}
          </Text>
        </View>

        {/* Summary */}
        <ReportSummaryCard title="Tổng quan" items={summaryItems} />

        {/* Export Options */}
        <View style={styles.exportCard}>
          <Text style={styles.exportTitle}>Xuất báo cáo</Text>
          <View style={styles.formatContainer}>
            {(['pdf', 'excel', 'csv'] as ReportFormat[]).map(format => (
              <TouchableOpacity
                key={format}
                style={[
                  styles.formatButton,
                  selectedFormat === format && styles.formatButtonActive,
                ]}
                onPress={() => setSelectedFormat(format)}
              >
                <Text
                  style={[
                    styles.formatText,
                    selectedFormat === format && styles.formatTextActive,
                  ]}
                >
                  {format.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}
            disabled={exportReportMutation.isPending}
          >
            {exportReportMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.exportButtonText}>
                📥 Xuất {selectedFormat.toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Inventory Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.itemsTitle}>
            Danh sách ({reportData.data.length} mặt hàng)
          </Text>
          {reportData.data.map(item => (
            <InventoryCard key={item._id} item={item} onPress={() => {}} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 80,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  infoBranch: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 4,
  },
  infoDate: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  exportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  formatContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  formatButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  formatButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  formatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  formatTextActive: {
    color: '#4CAF50',
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemsSection: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
});
