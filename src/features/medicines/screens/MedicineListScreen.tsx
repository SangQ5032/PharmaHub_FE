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
  ScrollView,
} from 'react-native';
import { useMedicines } from '../hooks/useMedicines';
import MedicineItem from '../components/MedicineItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
// import apiClient from '@shared/services/api';

const MedicineListScreen: React.FC = () => {
  const { medicines, loading, error, refresh, search, setSearch } =
    useMedicines();
  const navigation = useNavigation<any>();

  // ----- Filters state -----
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // expiryOption: null(no filter) | 30 | 60 | 365
  const [expiryOption, setExpiryOption] = useState<number | null>(null);
  // quantity-based stock filters removed

  // const baseURL = (apiClient && (apiClient.defaults as any)?.baseURL) || '<no-baseURL>';

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  // ----- Derived helpers -----
  const categories = useMemo(() => {
    const set = new Set<string>();
    medicines.forEach(m => {
      const c = (m as any).category;
      if (typeof c === 'string' && c.trim()) set.add(c.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [medicines]);

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

  // quantity-based stock level helpers removed

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      // category filter (multi)
      if (selectedCategories.length > 0) {
        const c = (m as any).category?.trim();
        if (!c || !selectedCategories.includes(c)) return false;
      }

      // expiry filter (single: <= N days)
      if (expiryOption != null) {
        const daysLeft = getDaysLeft((m as any).expiry_date);
        if (typeof daysLeft !== 'number' || !(daysLeft <= expiryOption)) {
          return false;
        }
      }

      // quantity-based stock filtering removed

      return true;
    });
  }, [medicines, selectedCategories, expiryOption]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setExpiryOption(null);
    // reset for removed stock filters not needed
  };

  const selectedChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    selectedCategories.forEach(c =>
      chips.push({
        key: `cat:${c}`,
        label: c,
        onRemove: () =>
          setSelectedCategories(prev => prev.filter(x => x !== c)),
      }),
    );
    if (expiryOption != null) {
      const label =
        expiryOption === 365 ? 'HSD ≤ 1 năm' : `HSD ≤ ${expiryOption} ngày`;
      chips.push({
        key: `exp:${expiryOption}`,
        label,
        onRemove: () => setExpiryOption(null),
      });
    }
    return chips;
  }, [selectedCategories, expiryOption]);

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
            placeholder="Tìm theo tên thuốc..."
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Filters row */}
        <View style={styles.filtersRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {selectedChips.length === 0 ? (
              <Text style={styles.chipsPlaceholder}>Chưa chọn bộ lọc</Text>
            ) : (
              selectedChips.map(chip => (
                <View key={chip.key} style={styles.chip}>
                  <Text style={styles.chipText}>{chip.label}</Text>
                  <TouchableOpacity
                    onPress={chip.onRemove}
                    style={styles.chipRemove}
                  >
                    <Text style={styles.chipRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.filterButtonText}>Lọc</Text>
          </TouchableOpacity>
        </View>

        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.left]}>TÊN THUỐC</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.center]}>GIÁ</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.center]}>HSD</Text>
          </View>
          {/* SL column removed */}
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
            style={styles.pillButton}
            onPress={() => navigation.navigate(ROUTES.ADD_MEDICINE)}
            activeOpacity={0.8}
          >
            <Text style={styles.pillButtonText}>＋ Thêm thuốc</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Bộ lọc</Text>

            {/* Category */}
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.optionsWrap}>
              {categories.length === 0 ? (
                <Text style={styles.muted}>Không có category</Text>
              ) : (
                categories.map(c => {
                  const selected = selectedCategories.includes(c);
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.optionPill,
                        selected && styles.optionPillSelected,
                      ]}
                      onPress={() =>
                        setSelectedCategories(prev =>
                          prev.includes(c)
                            ? prev.filter(x => x !== c)
                            : [...prev, c],
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.optionPillText,
                          selected && styles.optionPillTextSelected,
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>

            <Text style={styles.sectionTitle}>Hạn sử dụng</Text>
            <View style={styles.optionsWrap}>
              {[30, 60, 365].map(n => {
                const selected = expiryOption === n;
                const label = n === 365 ? '≤ 1 năm' : `≤ ${n} ngày`;
                return (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.optionPill,
                      selected && styles.optionPillSelected,
                    ]}
                    onPress={() =>
                      setExpiryOption(prev => (prev === n ? null : n))
                    }
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        selected && styles.optionPillTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quantity-based filter section removed */}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnGhost]}
                onPress={clearAllFilters}
              >
                <Text style={[styles.modalButtonText, styles.btnGhostText]}>
                  Bỏ tất cả lựa chọn
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnPrimary]}
                onPress={() => setFilterVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.btnPrimaryText]}>
                  Áp dụng
                </Text>
              </TouchableOpacity>
            </View>
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

  // filters
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F9FBFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
  },
  chipsContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingRight: 8,
  },
  chipsPlaceholder: { color: '#888' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E6E6',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  chipText: { color: '#2E7D32', fontWeight: '600' },
  chipRemove: { marginLeft: 6 },
  chipRemoveText: { color: '#888', fontSize: 16, lineHeight: 16 },
  filterButton: {
    backgroundColor: '#2EB872',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  filterButtonText: { color: '#fff', fontWeight: '700' },

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
    flex: 1,
    paddingHorizontal: 6,
    minWidth: 0,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },

  bottomBar: { padding: 12 },
  pillButton: {
    width: '100%',
    backgroundColor: '#2EB872',
    paddingVertical: 12,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
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

  // modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '700',
    color: '#333',
  },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  optionPill: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  optionPillSelected: {
    backgroundColor: '#2EB872',
    borderColor: '#2EB872',
  },
  optionPillText: { color: '#333', fontWeight: '600' },
  optionPillTextSelected: { color: '#fff' },
  muted: { color: '#888' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalButtonText: { fontWeight: '700' },
  btnPrimary: { backgroundColor: '#2EB872' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0' },
  btnGhostText: { color: '#333', fontWeight: '600' },
});

export default MedicineListScreen;
