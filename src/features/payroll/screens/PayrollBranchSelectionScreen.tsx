import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBranches } from '@features/branches/hooks/useBranches';
import { ROUTES } from '@shared/constants/routes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Branch {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
  manager_id?: string;
}

export const PayrollBranchSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: branchesResponse, isLoading, refetch } = useBranches();
  const [refreshing, setRefreshing] = useState(false);

  // Debug log
  React.useEffect(() => {
    console.log('=== PayrollBranchSelectionScreen Debug ===');
    console.log('branchesResponse:', branchesResponse);
    console.log('isLoading:', isLoading);
    console.log('isArray:', Array.isArray(branchesResponse));
  }, [branchesResponse, isLoading]);

  // Hook returns res.data which extracts the array from { success: true, data: [...] }
  // So branchesResponse is already the branches array
  const branches: Branch[] = Array.isArray(branchesResponse)
    ? branchesResponse
    : [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSelectBranch = (branch: Branch) => {
    // Navigate to payroll list for this branch
    (navigation as any).navigate(ROUTES.BRANCH_PAYROLL_LIST, {
      branchId: branch._id,
      branchName: branch.name,
    });
  };

  const renderBranchCard = ({ item }: { item: Branch }) => (
    <TouchableOpacity
      style={styles.branchCard}
      onPress={() => handleSelectBranch(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="office-building"
            size={32}
            color="#1976d2"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.branchName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.address && (
            <Text style={styles.branchAddress} numberOfLines={2}>
              {item.address}
            </Text>
          )}
          {item.phone && <Text style={styles.branchPhone}>{item.phone}</Text>}
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#999"
          style={styles.arrow}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chọn Chi Nhánh</Text>
        <Text style={styles.headerSubtitle}>
          Chọn chi nhánh để xem bảng lương
        </Text>
      </View>

      {isLoading && !branches.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>
            Đang tải danh sách chi nhánh...
          </Text>
        </View>
      ) : branches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="office-building-outline"
            size={48}
            color="#ccc"
          />
          <Text style={styles.emptyText}>Không có chi nhánh nào</Text>
        </View>
      ) : (
        <FlatList
          data={branches}
          renderItem={renderBranchCard}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  listContent: {
    padding: 12,
  },
  branchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  branchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    lineHeight: 16,
  },
  branchPhone: {
    fontSize: 12,
    color: '#666',
  },
  arrow: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ccc',
  },
});
