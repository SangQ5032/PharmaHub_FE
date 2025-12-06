/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Medicine } from '../types';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { deleteMedicine } from '../services/medicineService';

const formatPrice = (p?: number | null) => {
  if (p == null) return '-';
  const num = typeof p === 'string' ? Number(p) : p;
  if (Number.isNaN(num)) return String(p);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const getBasePrice = (medicine: Medicine) => {
  // Ưu tiên lấy từ prices object (cấu trúc mới)
  if (medicine.prices) {
    const basePrice = medicine.prices.base_unit_price;
    if (basePrice && basePrice > 0) {
      return formatPrice(basePrice);
    }
    // Fallback về price_per_unit.tablet
    const tabletPrice = medicine.prices.price_per_unit?.tablet;
    if (tabletPrice && tabletPrice > 0) {
      return formatPrice(tabletPrice);
    }
  }

  // Fallback về units array (legacy support)
  if (
    medicine.units &&
    Array.isArray(medicine.units) &&
    medicine.units.length > 0
  ) {
    const baseUnit = medicine.units.find(u => u.multiplier === 1);
    if (baseUnit) {
      return formatPrice(baseUnit.price);
    }
    const minPrice = Math.min(...medicine.units.map(u => u.price));
    return formatPrice(minPrice);
  }

  return '-';
};

const MedicineItem: React.FC<{ item: Medicine; onUpdated?: () => void }> = ({
  item,
  onUpdated,
}) => {
  const navigation = useNavigation<any>();
  const [actionsVisible, setActionsVisible] = useState(false);

  const handleEdit = () => {
    navigation.navigate(ROUTES.ADD_MEDICINE, { mode: 'edit', item });
  };

  const confirmDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa thuốc này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedicine(String(item._id));
              if (onUpdated) onUpdated();
            } catch (err: any) {
              Alert.alert('Lỗi', err?.message ?? 'Xóa thất bại');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const openActions = () => setActionsVisible(true);
  const closeActions = () => setActionsVisible(false);
  const handleViewDetail = () => {
    closeActions();
    navigation.navigate(ROUTES.MEDICINE_DETAIL, { item });
  };
  const handleEditFromSheet = () => {
    closeActions();
    handleEdit();
  };
  const handleDeleteFromSheet = () => {
    closeActions();
    confirmDelete();
  };

  return (
    <>
      <TouchableOpacity onPress={openActions} activeOpacity={0.8}>
        <View style={styles.card}>
          <View style={styles.row}>
            {/* Name (30%) */}
            <View style={[styles.cell, { flex: 30 }]}>
              <Text style={[styles.cellText, styles.left]} numberOfLines={1}>
                {item.name || '-'}
              </Text>
            </View>

            {/* Dosage Form (20%) */}
            <View style={[styles.cell, { flex: 20 }]}>
              <Text style={[styles.cellText, styles.center]} numberOfLines={1}>
                {item.dosage_form || '-'}
              </Text>
            </View>

            {/* Strength (15%) */}
            <View style={[styles.cell, { flex: 15 }]}>
              <Text style={[styles.cellText, styles.center]} numberOfLines={1}>
                {item.strength || '-'}
              </Text>
            </View>

            {/* Price (20%) */}
            <View style={[styles.cell, { flex: 20 }]}>
              <Text style={[styles.cellText, styles.center]}>
                {getBasePrice(item)}
              </Text>
            </View>

            {/* Status (15%) */}
            <View style={[styles.cell, { flex: 15 }]}>
              <Text style={[styles.cellText, styles.center]}>
                {item.status === 'active' ? '✓' : '✗'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* Action Sheet Modal (outside Touchable to avoid text child warning) */}
      <Modal
        visible={actionsVisible}
        transparent
        animationType="fade"
        onRequestClose={closeActions}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Chọn hành động</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleViewDetail}
            >
              <Text style={styles.actionText}>Xem chi tiết</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEditFromSheet}
            >
              <Text style={styles.actionText}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionDanger]}
              onPress={handleDeleteFromSheet}
            >
              <Text style={[styles.actionText, styles.actionDangerText]}>
                Xóa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionCancel]}
              onPress={closeActions}
            >
              <Text style={[styles.actionText, styles.actionCancelText]}>
                Hủy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  cell: {
    paddingHorizontal: 6,
    minWidth: 0,
  },
  cellText: {
    fontSize: 13,
    color: '#222',
  },
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  // modal styles
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionButton: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  actionText: { textAlign: 'center', fontWeight: '700', color: '#333' },
  actionDanger: {},
  actionDangerText: { color: '#D32F2F' },
  actionCancel: { borderBottomWidth: 0, marginTop: 6 },
  actionCancelText: { color: '#2EB872' },
});

export default MedicineItem;
