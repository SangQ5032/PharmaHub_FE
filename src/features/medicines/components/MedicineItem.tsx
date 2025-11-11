import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Medicine } from '../types';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { deleteMedicine } from '../services/medicineService';

const formatPrice = (p?: number | string) => {
  if (p == null || p === '') return '-';
  const num = typeof p === 'string' ? Number(p) : p;
  if (Number.isNaN(num)) return String(p);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatDate = (d?: string) => {
  if (!d) return '-';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const getTagInfo = (threshold?: number) => {
  if (threshold == null) return null;
  if (threshold >= 200) return { label: 'High', bg: '#C8E6C9' }; // light green
  if (threshold >= 100 && threshold <= 200)
    return { label: 'Med', bg: '#FFF9C4' }; // light yellow
  return { label: 'Low', bg: '#FFCDD2' }; // light red
};

// Tính số ngày còn lại đến hạn sử dụng
const getDaysLeft = (d?: string) => {
  if (!d) return undefined;
  const exp = new Date(d);
  if (Number.isNaN(exp.getTime())) return undefined;
  const today = new Date();
  exp.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((exp.getTime() - today.getTime()) / msPerDay);
};

const MedicineItem: React.FC<{ item: Medicine; onUpdated?: () => void }> = ({
  item,
  onUpdated,
}) => {
  const navigation = useNavigation<any>();
  // ưu tiên quantity để tag (hoặc fallback vào warning_threshold)
  const tag = getTagInfo(
    (item.quantity ?? (item as any).warning_threshold) as number,
  );

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

  const handlePress = () => {
    Alert.alert(
      'Chọn hành động',
      'Bạn muốn làm gì với thuốc này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Sửa', onPress: handleEdit },
        { text: 'Xóa', onPress: confirmDelete, style: 'destructive' },
      ],
      { cancelable: true },
    );
  };

  // xác định màu nền card theo hạn sử dụng
  const daysLeft = getDaysLeft(item.expiry_date);
  const isExpired = typeof daysLeft === 'number' ? daysLeft < 0 : false;
  const isNear = typeof daysLeft === 'number' ? daysLeft <= 10 : false;
  const cardBgStyle =
    daysLeft == null
      ? null
      : isExpired || isNear
      ? styles.cardNearExpiry
      : styles.cardValid;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={[styles.card, cardBgStyle]}>
        <View style={styles.row}>
          {/* Name (25%) */}
          <View style={[styles.cell, { flex: 25 }]}>
            <Text style={[styles.cellText, styles.left]} numberOfLines={1}>
              {item.name || '-'}
            </Text>
          </View>

          {/* Price (25%) */}
          <View style={[styles.cell, { flex: 25 }]}>
            <Text style={[styles.cellText, styles.center]}>
              {formatPrice(item.price)}
            </Text>
          </View>

          {/* Expiry (30%) */}
          <View style={[styles.cell, { flex: 30 }]}>
            <Text style={[styles.cellText, styles.center]}>
              {formatDate(item.expiry_date)}
            </Text>
          </View>

          {/* SL + Tag (20%) - tag hiển thị ngang hàng với item */}
          <View
            style={[
              styles.cell,
              { flex: 20, justifyContent: 'center', alignItems: 'flex-end' },
            ]}
          >
            <View style={styles.slRow}>
              {/* chỉ hiện tag */}
              {tag ? (
                <View style={[styles.tag, { backgroundColor: tag.bg }]}>
                  <Text style={styles.tagText}>{tag.label}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#fff', // sẽ bị ghi đè bởi cardNearExpiry/cardValid nếu có
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    margin: 10,
  },
  // nền đỏ nhạt khi còn <= 10 ngày hoặc đã hết hạn
  cardNearExpiry: {
    backgroundColor: '#FFEBEE', // red 50
    borderColor: '#FFCDD2',
  },
  // nền xanh lá nhạt khi còn hạn > 10 ngày
  cardValid: {
    backgroundColor: '#E8F5E9', // green 50
    borderColor: '#C8E6C9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0, // loại bỏ khoảng cách trên tag
  },
  cell: {
    paddingHorizontal: 6,
    minWidth: 0,
  },
  cellText: {
    fontSize: 14,
    color: '#222',
  },
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  slRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tag: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tagText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default MedicineItem;
