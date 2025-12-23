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
import MedicineItemReadOnly from '../components/MedicineItemReadOnly';
import { useFocusEffect } from '@react-navigation/native';

const EmployeeMedicineListScreen: React.FC = () => {
  const { medicines, loading, error, refresh, search, setSearch } =
    useMedicines();

  // ----- Filters state -----
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  // ----- Derived helpers -----
  const categories = useMemo(() => {
    const set = new Set<string>();
    medicines.forEach(m => {
      const c = m.category_id?.name;
      if (typeof c === 'string' && c.trim()) set.add(c.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      // category filter (multi)
      if (selectedCategories.length > 0) {
        const c = m.category_id?.name?.trim();
        if (!c || !selectedCategories.includes(c)) return false;
      }
      return true;
    });
  }, [medicines, selectedCategories]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
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
    return chips;
  }, [selectedCategories]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Danh sách thuốc</Text>
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
        {/* <View style={styles.filtersRow}>
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
        </View> */}

        {/* Summary info */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Tổng: {filteredMedicines.length} thuốc
          </Text>
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
          renderItem={({ item }) => <MedicineItemReadOnly item={item} />}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
          contentContainerStyle={
            filteredMedicines.length === 0
              ? styles.emptyContainer
              : styles.listContent
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có thuốc nào</Text>
                <Text style={styles.emptySubText}>
                  Thử tìm kiếm với từ khóa khác
                </Text>
              </View>
            ) : null
          }
        />
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
            <Text style={styles.sectionTitle}>Nhóm thuốc</Text>
            <View style={styles.optionsWrap}>
              {categories.length === 0 ? (
                <Text style={styles.muted}>Không có nhóm thuốc</Text>
              ) : (
                categories.map(c => {
                  const selected = selectedCategories.includes(c);
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.checkboxRow,
                        selected && styles.checkboxRowSelected,
                      ]}
                      onPress={() =>
                        setSelectedCategories(prev =>
                          prev.includes(c)
                            ? prev.filter(x => x !== c)
                            : [...prev, c],
                        )
                      }
                    >
                      <View
                        style={[
                          styles.checkbox,
                          selected && styles.checkboxSelected,
                        ]}
                      >
                        {selected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text
                        style={[
                          styles.checkboxLabel,
                          selected && styles.checkboxLabelSelected,
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>

            {/* Action buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.clearBtn]}
                onPress={() => {
                  clearAllFilters();
                  setFilterVisible(false);
                }}
              >
                <Text style={styles.clearBtnText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.applyBtn]}
                onPress={() => setFilterVisible(false)}
              >
                <Text style={styles.applyBtnText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  titleContainer: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    letterSpacing: 0.3,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A202C',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filtersRow: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    gap: 8,
  },
  chipsPlaceholder: {
    color: '#94A3B8',
    fontSize: 13,
    fontStyle: 'italic',
  },
  chip: {
    backgroundColor: '#E0F2FE',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  chipText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '600',
  },
  chipRemove: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BAE6FD',
    borderRadius: 9,
  },
  chipRemoveText: {
    fontSize: 14,
    color: '#0369A1',
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  summaryText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  error: {
    color: '#DC2626',
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 14,
  },
  retry: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 16,
  },
  optionsWrap: {
    gap: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  checkboxRowSelected: {
    backgroundColor: '#E3F2FD',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxSelected: {
    borderColor: '#2EB872',
    backgroundColor: '#2EB872',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  checkboxLabelSelected: {
    color: '#2EB872',
    fontWeight: '600',
  },
  muted: {
    color: '#999',
    fontSize: 13,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearBtnText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: '#2EB872',
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EmployeeMedicineListScreen;
