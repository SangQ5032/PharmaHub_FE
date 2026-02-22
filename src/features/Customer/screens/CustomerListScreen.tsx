// Customer/Customer/screens/CustomerListScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useCustomers } from '../hooks/useCustomers';
import CustomerItem from '../components/CustomerItem';

const CustomerListScreen = ({ navigation }: any) => {
  const { customers, loading, error, search, setSearch, reload } =
    useCustomers();

  const handlePressCustomer = (item: any) => {
    // TÊN ROUTE phải trùng với Stack.Screen của bạn (ví dụ: "CustomerDetail")
    navigation.navigate('CustomerDetail', { customer: item });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tìm khách hàng..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.filterBox}>
          <Text style={styles.filterText}>Lọc theo: Ngày tạo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addSmall}>
          <Text style={styles.addSmallText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statBox}>
        <View>
          <Text style={styles.statLabel}>Tổng khách hàng</Text>
          {/* TODO: có thể thay bằng customers.length nếu muốn */}
          <Text style={styles.statValue}>2,438</Text>
        </View>

        <View>
          <Text style={styles.statLabel}>Khách mới trong tháng</Text>
          <Text style={styles.statValue}>156</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={[styles.headerText, { flex: 2 }]}>Tên khách hàng</Text>
        <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>
          Số điện thoại
        </Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && !error && customers.length === 0 ? (
        <Text style={styles.emptyText}>Không có khách hàng nào</Text>
      ) : null}

      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CustomerItem item={item} onPress={() => handlePressCustomer(item)} />
        )}
        refreshing={loading}
        onRefresh={reload}
      />

      <Text style={styles.page}>Trang 1 / 10</Text>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.export}>
          <Text style={styles.exportText}>Xuất CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.add}>
          <Text style={styles.addText}>Thêm khách hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomerListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },

  search: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },

  row: { flexDirection: 'row', marginBottom: 14 },

  filterBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    borderRadius: 16,
  },

  filterText: { fontSize: 13, color: '#444' },

  addSmall: {
    backgroundColor: '#2EB872',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginLeft: 8,
  },

  addSmallText: { color: '#FFF', fontWeight: '600' },

  statBox: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  statLabel: { fontSize: 12, color: '#777' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#1B5E20' },

  header: { flexDirection: 'row', marginBottom: 6 },
  headerText: { fontSize: 12, fontWeight: '600', color: '#777' },

  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginVertical: 8,
    fontSize: 12,
  },

  page: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#777',
    fontSize: 12,
  },

  bottomRow: { flexDirection: 'row', marginTop: 10 },

  export: {
    flex: 1,
    borderColor: '#2EB872',
    borderWidth: 1,
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  exportText: { color: '#2EB872', fontWeight: '600' },

  add: {
    flex: 1,
    backgroundColor: '#2EB872',
    padding: 14,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: 'center',
  },
  addText: { color: '#FFF', fontWeight: '600' },
});
