// src/features/warehouse/screens/ReportSelectionScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ReportTemplateCard } from '@features/warehouse/components/ReportTemplateCard';
import {
  ReportTemplate,
  ReportType,
  ReportFormat,
  ReportFilter,
} from '@features/warehouse/types/report.types';
import { ROUTES } from '@shared/constants/routes';

export default function ReportSelectionScreen() {
  const navigation = useNavigation();

  // State
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [filter, setFilter] = useState<ReportFilter>({});

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'inventory',
      type: 'inventory',
      title: 'Báo cáo tồn kho',
      description: 'Báo cáo chi tiết về tình trạng tồn kho tất cả thuốc',
      icon: '📦',
      color: '#2196F3',
      defaultFormat: 'pdf',
    },
    {
      id: 'low_stock',
      type: 'low_stock',
      title: 'Báo cáo thuốc sắp hết',
      description: 'Danh sách các thuốc có số lượng tồn thấp',
      icon: '⚠️',
      color: '#FF9800',
      defaultFormat: 'excel',
    },
    {
      id: 'out_of_stock',
      type: 'out_of_stock',
      title: 'Báo cáo thuốc hết hàng',
      description: 'Danh sách các thuốc đã hết hàng',
      icon: '🚫',
      color: '#F44336',
      defaultFormat: 'excel',
    },
    {
      id: 'expiring',
      type: 'expiring',
      title: 'Báo cáo thuốc sắp hết hạn',
      description: 'Danh sách các thuốc sắp hết hạn sử dụng',
      icon: '⏰',
      color: '#9C27B0',
      defaultFormat: 'pdf',
    },
  ];

  // Format options
  const formatOptions: { value: ReportFormat; label: string; icon: string }[] =
    [
      { value: 'pdf', label: 'PDF', icon: '📄' },
      { value: 'excel', label: 'Excel', icon: '📊' },
      { value: 'csv', label: 'CSV', icon: '📋' },
    ];

  // Handle template selection
  const handleTemplatePress = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setSelectedFormat(template.defaultFormat);
    setShowFilterModal(true);
  };

  // Handle generate report
  const handleGenerateReport = () => {
    if (!selectedTemplate) return;

    setShowFilterModal(false);

    // Navigate to report view screen
    navigation.navigate(
      ROUTES.REPORT_VIEW as never,
      {
        type: selectedTemplate.type,
        format: selectedFormat,
        filter: filter,
        title: selectedTemplate.title,
      } as never,
    );
  };

  // Render filter modal
  const renderFilterModal = () => {
    if (!selectedTemplate) return null;

    return (
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTemplate.title}</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Format Selection */}
              <Text style={styles.sectionTitle}>Định dạng xuất</Text>
              <View style={styles.formatContainer}>
                {formatOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.formatButton,
                      selectedFormat === option.value &&
                        styles.formatButtonActive,
                    ]}
                    onPress={() => setSelectedFormat(option.value)}
                  >
                    <Text style={styles.formatIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.formatLabel,
                        selectedFormat === option.value &&
                          styles.formatLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Branch Filter */}
              <Text style={styles.sectionTitle}>Chi nhánh (tùy chọn)</Text>
              <TextInput
                style={styles.input}
                placeholder="Tất cả chi nhánh"
                value={filter.branch_id || ''}
                onChangeText={text => setFilter({ ...filter, branch_id: text })}
              />

              {/* Category Filter */}
              <Text style={styles.sectionTitle}>Danh mục (tùy chọn)</Text>
              <TextInput
                style={styles.input}
                placeholder="Tất cả danh mục"
                value={filter.category || ''}
                onChangeText={text => setFilter({ ...filter, category: text })}
              />

              {/* Date Range Filter */}
              <Text style={styles.sectionTitle}>
                Khoảng thời gian (tùy chọn)
              </Text>
              <View style={styles.dateRangeContainer}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  placeholder="Từ ngày"
                  value={filter.start_date || ''}
                  onChangeText={text =>
                    setFilter({ ...filter, start_date: text })
                  }
                />
                <Text style={styles.dateSeparator}>-</Text>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  placeholder="Đến ngày"
                  value={filter.end_date || ''}
                  onChangeText={text =>
                    setFilter({ ...filter, end_date: text })
                  }
                />
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={handleGenerateReport}
              >
                <Text style={styles.generateButtonText}>Tạo báo cáo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn loại báo cáo</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Chọn loại báo cáo bạn muốn tạo và xuất
        </Text>

        {reportTemplates.map(template => (
          <ReportTemplateCard
            key={template.id}
            template={template}
            onPress={() => handleTemplatePress(template)}
          />
        ))}
      </ScrollView>

      {/* Filter Modal */}
      {renderFilterModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  closeButton: {
    fontSize: 24,
    color: '#757575',
  },
  modalBody: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
    marginTop: 16,
  },
  formatContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  formatButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  formatIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  formatLabel: {
    fontSize: 14,
    color: '#757575',
  },
  formatLabelActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
  },
  dateSeparator: {
    fontSize: 16,
    color: '#757575',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  generateButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
