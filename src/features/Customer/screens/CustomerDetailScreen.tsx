import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Customer } from '../types/customer';

type Invoice = {
  id: string;
  code: string;
  date: string;
  time: string;
  amount: string;
  status: string;
};

// Chỉ giữ 1 hoá đơn để test
const mockInvoices: Invoice[] = [
  {
    id: '1',
    code: '#HDTEST0001',
    date: '21/10/2025',
    time: '09:30',
    amount: '150.000đ',
    status: 'Đã TT',
  },
];

type Props = {
  route: {
    params: {
      customer: Customer;
    };
  };
};

const CustomerDetailScreen = ({ route }: Props) => {
  // Nhận đúng 1 khách hàng từ màn danh sách
  const customer = route.params.customer;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Tìm theo tên / SDT / Mã KH..."
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
            <Text style={[styles.filterTabText, styles.filterTabTextActive]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>30 ngày</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>6 tháng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>Tuỳ chọn</Text>
          </TouchableOpacity>
        </View>

        {/* Customer card */}
        <View style={styles.customerCard}>
          <View style={styles.avatar} />

          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerCode}>{customer.code}</Text>
            <Text style={styles.customerPhone}>{customer.phone}</Text>
            <Text style={styles.customerRank}>Hạng: Khách test</Text>
          </View>
        </View>

        {/* Stats row – dùng số cố định để test */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Hoá đơn</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>150.000đ</Text>
            <Text style={styles.statLabel}>Tổng chi tiêu</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Lần mua (6 tháng)</Text>
          </View>
        </View>

        {/* Invoice section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hoá đơn liên quan</Text>
          <Text style={styles.sectionSort}>Sắp xếp: Mới nhất</Text>
        </View>

        {/* Invoice list */}
        {mockInvoices.map(item => (
          <View key={item.id} style={styles.invoiceCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.invoiceCode}>{item.code}</Text>
              <Text style={styles.invoiceDate}>
                {item.date} · {item.time}
              </Text>
            </View>

            <View style={styles.invoiceRight}>
              <Text style={styles.invoiceAmount}>{item.amount}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* More link */}
        <TouchableOpacity style={styles.moreHistory}>
          <Text style={styles.moreHistoryText}>Xem thêm lịch sử...</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom tab bar (giống thiết kế) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.tabDot} />
          <Text style={styles.tabLabel}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItemActive}>
          <View style={styles.tabDotActive} />
          <Text style={styles.tabLabelActive}>Hoá đơn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.tabDot} />
          <Text style={styles.tabLabel}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomerDetailScreen;

const GREEN = '#2EB872';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchButton: {
    marginLeft: 8,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    color: '#FFF',
    fontSize: 16,
  },

  // Filter tabs
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  filterTabActive: {
    backgroundColor: '#E1F7EC',
  },
  filterTabText: {
    fontSize: 12,
    color: '#555',
  },
  filterTabTextActive: {
    color: GREEN,
    fontWeight: '600',
  },

  // Customer card
  customerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E1F7EC',
    marginRight: 14,
  },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '700', color: '#222' },
  customerCode: { fontSize: 12, color: '#777', marginTop: 2 },
  customerPhone: { fontSize: 13, color: '#444', marginTop: 4 },
  customerRank: { fontSize: 12, color: '#777', marginTop: 2 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F5FFF9',
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: { fontSize: 15, fontWeight: '700', color: GREEN },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 3,
    textAlign: 'center',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#222' },
  sectionSort: { fontSize: 12, color: '#777' },

  // Invoice card
  invoiceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  invoiceCode: { fontSize: 13, fontWeight: '600', color: '#222' },
  invoiceDate: { fontSize: 11, color: '#777', marginTop: 4 },
  invoiceRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  invoiceAmount: { fontSize: 13, fontWeight: '600', color: '#222' },
  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E1F7EC',
  },
  statusText: {
    fontSize: 11,
    color: GREEN,
    fontWeight: '600',
  },

  moreHistory: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 80,
  },
  moreHistoryText: {
    fontSize: 12,
    color: GREEN,
    textDecorationLine: 'underline',
  },

  // Bottom tab bar
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabItemActive: {
    alignItems: 'center',
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginBottom: 4,
  },
  tabDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: '#777',
  },
  tabLabelActive: {
    fontSize: 11,
    color: GREEN,
    fontWeight: '600',
  },
});
