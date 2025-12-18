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
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

const getBaseUnitName = (medicine: Medicine): string => {
  if (typeof medicine.base_unit === 'object' && medicine.base_unit?.name) {
    return medicine.base_unit.name;
  }
  if (typeof medicine.base_unit === 'string') {
    return medicine.base_unit;
  }
  return 'đơn vị';
};

// Lấy tất cả các đơn vị (base_unit + units) với tỷ lệ chuyển đổi
const getAllUnits = (
  medicine: Medicine,
): Array<{ name: string; ratio: number; id?: string }> => {
  const units: Array<{ name: string; ratio: number; id?: string }> = [];

  // Thêm base_unit (tỷ lệ = 1)
  const baseUnitName = getBaseUnitName(medicine);
  const baseUnitId =
    typeof medicine.base_unit === 'object' ? medicine.base_unit._id : undefined;
  units.push({ name: baseUnitName, ratio: 1, id: baseUnitId });

  // Thêm các units khác nếu có
  if (medicine.units && Array.isArray(medicine.units)) {
    medicine.units.forEach(unit => {
      if (unit && unit.name) {
        // Ưu tiên lấy tỷ lệ từ unit_ratios (chính xác hơn)
        let ratio = unit.ratio_to_base || 1;

        // Nếu có unit_ratios, tìm tỷ lệ theo _id của unit
        if (medicine.unit_ratios && typeof medicine.unit_ratios === 'object') {
          const unitId = unit._id;
          if (unitId && medicine.unit_ratios[unitId] != null) {
            ratio = medicine.unit_ratios[unitId];
          }
        }

        units.push({ name: unit.name, ratio, id: unit._id });
      }
    });
  }

  return units;
};

// Tính toán và format hiển thị mối quan hệ giữa các đơn vị
const getUnitDisplayText = (
  currentUnit: { name: string; ratio: number },
  allUnits: Array<{ name: string; ratio: number }>,
): string => {
  // Nếu là base unit (ratio = 1), chỉ hiển thị tên
  if (currentUnit.ratio === 1) {
    return currentUnit.name;
  }

  // Tính toán mối quan hệ với các đơn vị khác
  const relationships: string[] = [];

  // Luôn hiển thị tỷ lệ với base unit
  const baseUnit = allUnits.find(u => u.ratio === 1);
  if (baseUnit) {
    relationships.push(`${currentUnit.ratio} ${baseUnit.name}`);
  }

  // Tính toán mối quan hệ với các đơn vị khác (không phải base)
  allUnits.forEach(otherUnit => {
    if (otherUnit.ratio !== 1 && otherUnit.name !== currentUnit.name) {
      // Tính xem 1 đơn vị hiện tại = bao nhiêu đơn vị khác
      const ratioToOther = currentUnit.ratio / otherUnit.ratio;

      // Chỉ hiển thị nếu tỷ lệ là số nguyên và hợp lý (>= 1)
      if (ratioToOther >= 1 && Number.isInteger(ratioToOther)) {
        relationships.push(`${ratioToOther} ${otherUnit.name}`);
      }
    }
  });

  // Format: "Tên đơn vị (mối quan hệ)"
  if (relationships.length > 0) {
    return `${currentUnit.name} (${relationships.join(', ')})`;
  }

  return currentUnit.name;
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

  const importPrice = item.default_import_price;
  const retailPrice = item.default_retail_price;
  const allUnits = getAllUnits(item);
  const manufacturer = item.manufacturer || '-';
  const categoryName = item.category_id?.name || '-';

  return (
    <TouchableOpacity onPress={handleViewDetail} activeOpacity={0.7}>
      <View style={styles.card}>
        {/* Tên thuốc và nhà sản xuất */}
        <View style={styles.headerSection}>
          <Text style={styles.medicineName} numberOfLines={2}>
            {item.name}
          </Text>
          {manufacturer !== '-' && (
            <Text style={styles.manufacturer} numberOfLines={1}>
              {manufacturer}
            </Text>
          )}
        </View>

        {/* Thông tin đơn vị và danh mục */}
        <View style={styles.infoSection}>
          {/* Danh mục */}
          {categoryName !== '-' && (
            <View style={styles.infoRow}>
              <Text style={styles.sectionLabel}>Danh mục:</Text>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{categoryName}</Text>
              </View>
            </View>
          )}

          {/* Tất cả các đơn vị */}
          <View style={styles.unitsRow}>
            <Text style={styles.sectionLabel}>Đơn vị:</Text>
            <View style={styles.unitsContainer}>
              {allUnits.map((unit, index) => {
                const displayText = getUnitDisplayText(unit, allUnits);
                return (
                  <View key={index} style={styles.unitBadge}>
                    <Text style={styles.unitBadgeText}>{displayText}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Giá nhập và giá bán - QUAN TRỌNG NHẤT */}
        <View style={styles.priceSection}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Giá nhập</Text>
            <Text style={styles.importPrice}>{formatPrice(importPrice)}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Giá bán</Text>
            <Text style={styles.retailPrice}>{formatPrice(retailPrice)}</Text>
          </View>
        </View>

        {/* Trạng thái */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              item.is_active !== false
                ? styles.statusActive
                : styles.statusInactive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.is_active !== false
                  ? styles.statusTextActive
                  : styles.statusTextInactive,
              ]}
            >
              {item.is_active !== false ? 'Hoạt động' : 'Ngừng bán'}
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
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  headerSection: {
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 4,
  },
  manufacturer: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginRight: 4,
  },
  infoBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '600',
  },
  unitsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  unitBadge: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  unitBadgeText: {
    fontSize: 12,
    color: '#0C4A6E',
    fontWeight: '600',
  },
  unitRatio: {
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  importPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  retailPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  priceDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusInactive: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#059669',
  },
  statusTextInactive: {
    color: '#DC2626',
  },
});

export default MedicineItemReadOnly;
