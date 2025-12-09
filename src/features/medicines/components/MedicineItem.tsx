/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Medicine } from '../types';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { deleteMedicine } from '../services/medicineService';

// Helper function để đảm bảo giá trị là string
const ensureString = (value: any, fallback: string = '-'): string => {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (typeof value === 'object') {
    // Nếu là object, thử lấy các field thường dùng
    if ('name' in value && typeof value.name === 'string') return value.name;
    if ('_id' in value && typeof value._id === 'string') return value._id;
    if ('short_name' in value && typeof value.short_name === 'string')
      return value.short_name;
  }
  return fallback;
};

const formatPrice = (p?: number | null) => {
  if (p == null) return '-';
  const num = typeof p === 'string' ? Number(p) : p;
  if (Number.isNaN(num)) return String(p);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatDate = (d?: string | any) => {
  // Đảm bảo d là string trước khi xử lý
  if (!d) return '-';
  if (typeof d !== 'string') {
    // Nếu là object, thử lấy string từ các field thường dùng
    if (typeof d === 'object' && d !== null) {
      // Nếu có toString và không phải [object Object]
      if (typeof d.toString === 'function') {
        const str = d.toString();
        if (str && str !== '[object Object]') {
          d = str;
        } else {
          return '-';
        }
      } else {
        return '-';
      }
    } else {
      d = String(d);
    }
  }
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '-';
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const getBasePrice = (medicine: Medicine) => {
  // Ưu tiên lấy từ default_retail_price (cấu trúc mới)
  if (medicine.default_retail_price != null) {
    return formatPrice(medicine.default_retail_price);
  }

  // Fallback về prices object (legacy support)
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
    const baseUnit = medicine.units.find((u: any) => u.multiplier === 1);
    if (baseUnit) {
      return formatPrice((baseUnit as any).price);
    }
    const minPrice = Math.min(
      ...medicine.units.map((u: any) => (u as any).price),
    );
    return formatPrice(minPrice);
  }

  return '-';
};

const getBaseUnitName = (medicine: Medicine) => {
  // Cấu trúc mới: base_unit là object
  if (typeof medicine.base_unit === 'object' && medicine.base_unit !== null) {
    // Lấy name hoặc short_name, đảm bảo xử lý cả trường hợp là object
    const name = medicine.base_unit.name || medicine.base_unit.short_name;
    // Sử dụng ensureString để đảm bảo luôn trả về string
    return ensureString(name, '-');
  }
  // Legacy: base_unit là string
  if (typeof medicine.base_unit === 'string') {
    return medicine.base_unit;
  }
  // Fallback: nếu base_unit là bất kỳ giá trị nào khác, convert sang string
  return ensureString(medicine.base_unit, '-');
};

const MedicineItem: React.FC<{ item: Medicine; onUpdated?: () => void }> = ({
  item,
  onUpdated,
}) => {
  const navigation = useNavigation<any>();
  const [actionsVisible, setActionsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image error when item changes
  useEffect(() => {
    setImageError(false);
  }, [item.image_url]);

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
            {/* Image - fixed width */}
            <View style={styles.imageCell}>
              {item.image_url && !imageError ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.medicineImage}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Image
                  source={require('@shared/assets/columbina.png')}
                  style={styles.medicineImage}
                  resizeMode="cover"
                />
              )}
            </View>
            {/* Name (35%) */}
            <View style={[styles.cell, { flex: 35 }]}>
              <Text style={[styles.cellText, styles.left]} numberOfLines={1}>
                {ensureString(item.name)}
              </Text>
              {item.description && (
                <Text
                  style={[styles.cellSubText, styles.left]}
                  numberOfLines={1}
                >
                  {ensureString(item.description, '')}
                </Text>
              )}
              {item.manufacturing_date && (
                <Text
                  style={[styles.cellSubText, styles.left]}
                  numberOfLines={1}
                >
                  Hạn SX:{' '}
                  {formatDate(
                    typeof item.manufacturing_date === 'string'
                      ? item.manufacturing_date
                      : ensureString(item.manufacturing_date),
                  )}
                </Text>
              )}
            </View>

            {/* Manufacturer (20%) */}
            <View style={[styles.cell, { flex: 20 }]}>
              <Text style={[styles.cellText, styles.center]} numberOfLines={2}>
                {ensureString(item.manufacturer)}
              </Text>
            </View>

            {/* Base Unit (15%) */}
            <View style={[styles.cell, { flex: 15 }]}>
              <Text style={[styles.cellText, styles.center]} numberOfLines={1}>
                {getBaseUnitName(item)}
              </Text>
            </View>

            {/* Price (15%) */}
            <View style={[styles.cell, { flex: 15 }]}>
              <Text style={[styles.cellText, styles.center]}>
                {getBasePrice(item)} đ
              </Text>
            </View>

            {/* Status (15%) */}
            <View style={[styles.cell, { flex: 15 }]}>
              <Text style={[styles.cellText, styles.center]}>
                {item.is_active !== false ? '✓' : '✗'}
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
  cellSubText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  imageCell: {
    width: 50,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicineImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
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
