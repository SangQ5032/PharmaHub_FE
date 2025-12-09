import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBranches } from '@features/branches/hooks/useBranches';
import { ROUTES } from '@shared/constants/routes';

interface Branch {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
}

const WorkScheduleBranchSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data: branchesResponse, isLoading, refetch } = useBranches();
  const [refreshing, setRefreshing] = useState(false);

  // Get the target route from route params
  const targetRoute =
    (route.params as any)?.targetRoute ||
    ROUTES.SYSTEM_ADMIN_BRANCH_WORK_SCHEDULE;

  const branches: Branch[] = Array.isArray(branchesResponse)
    ? branchesResponse
    : [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSelectBranch = (branch: Branch) => {
    navigation.navigate(targetRoute as never, {
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
      <View style={styles.branchIconContainer}>
        <Icon name="office-building" size={32} color="#007AFF" />
      </View>
      <View style={styles.branchInfo}>
        <Text style={styles.branchName}>{item.name}</Text>
        {item.address && (
          <Text style={styles.branchAddress} numberOfLines={2}>
            {item.address}
          </Text>
        )}
        {item.phone && <Text style={styles.branchPhone}>{item.phone}</Text>}
      </View>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chọn Chi Nhánh</Text>
        <Text style={styles.headerSubtitle}>
          Chọn chi nhánh để xem thông tin lịch làm việc
        </Text>
      </View>

      {isLoading && !branches.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            Đang tải danh sách chi nhánh...
          </Text>
        </View>
      ) : branches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="office-building-outline" size={48} color="#ccc" />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  branchCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  branchIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  branchPhone: {
    fontSize: 12,
    color: '#999',
  },
});

export default WorkScheduleBranchSelectionScreen;
