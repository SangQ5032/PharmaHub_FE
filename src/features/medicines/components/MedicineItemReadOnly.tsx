/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Medicine } from '../types';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';

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

const formatDate = (d?: string) => {
  if (!d) return '-';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '-';
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
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

interface MedicineItemReadOnlyProps {
  item: Medicine;
}

const MedicineItemReadOnly: React.FC<MedicineItemReadOnlyProps> = ({
  item,
}) => {
  const navigation = useNavigation<any>();

  const handleViewDetail = () => {
    navigation.navigate(ROUTES.MEDICINE_DETAIL, { item });
  };

  return (
    <TouchableOpacity onPress={handleViewDetail} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.row}>
          {/* Name (30%) */}
          <View style={[styles.cell, { flex: 30 }]}>
            <Text style={[styles.cellText, styles.left]} numberOfLines={1}>
              {ensureString(item.name)}
            </Text>
            {item.manufacturing_date && (
              <Text style={[styles.cellSubText, styles.left]} numberOfLines={1}>
                Hạn SX: {formatDate(item.manufacturing_date)}
              </Text>
            )}
          </View>

          {/* Dosage Form (20%) */}
          <View style={[styles.cell, { flex: 20 }]}>
            <Text style={[styles.cellText, styles.center]} numberOfLines={1}>
              {ensureString(item.dosage_form)}
            </Text>
          </View>

          {/* Strength (15%) */}
          <View style={[styles.cell, { flex: 15 }]}>
            <Text style={[styles.cellText, styles.center]} numberOfLines={1}>
              {ensureString(item.strength)}
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
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cellText: {
    fontSize: 13,
    color: '#333',
  },
  cellSubText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
});

export default MedicineItemReadOnly;
