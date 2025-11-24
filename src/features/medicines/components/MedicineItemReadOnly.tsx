/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Medicine } from '../types';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';

const formatPrice = (p?: number | null) => {
  if (p == null) return '-';
  const num = typeof p === 'string' ? Number(p) : p;
  if (Number.isNaN(num)) return String(p);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
          {/* Name (35%) */}
          <View style={[styles.cell, { flex: 35 }]}>
            <Text style={[styles.cellText, styles.left]} numberOfLines={1}>
              {item.name || '-'}
            </Text>
          </View>

          {/* Category (25%) */}
          <View style={[styles.cell, { flex: 25 }]}>
            <Text style={[styles.cellText, styles.center]} numberOfLines={1}>
              {item.category_id?.name || '-'}
            </Text>
          </View>

          {/* Price (25%) */}
          <View style={[styles.cell, { flex: 25 }]}>
            <Text style={[styles.cellText, styles.center]}>
              {formatPrice(item.retail_price)}
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
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
});

export default MedicineItemReadOnly;
