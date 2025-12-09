// src/features/warehouse/screens/BranchInventoryManagementScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { useGetInventoryByBranch } from '@features/warehouse/hooks/useInventory';
import { useGetBatchesByBranch } from '@features/warehouse/hooks/useBatches';
import { useGetImports } from '@features/warehouse/hooks/useImports';
import { InventoryCard } from '@features/warehouse/components/InventoryCard';
import { BatchCard } from '@features/warehouse/components/BatchCard';
import { ImportHistoryCard } from '@features/warehouse/components/ImportHistoryCard';
import { ROUTES } from '@shared/constants/routes';

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { id: 'inventory', label: 'Thuốc', icon: 'pill' },
  { id: 'batches', label: 'Lô hàng', icon: 'package-box' },
  { id: 'imports', label: 'Lịch sử', icon: 'history' },
];

export default function BranchInventoryManagementScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const initialTab = route?.params?.initialTab || 'inventory';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore(state => state.user);
  const branchId = user?.branch_id;

  // Queries
  const inventoryQuery = useGetInventoryByBranch(branchId || '', {
    page: 1,
    limit: 50,
  });

  const batchesQuery = useGetBatchesByBranch(branchId || '', {
    page: 1,
    limit: 50,
    sort: 'expiry_date',
  });

  const importsQuery = useGetImports({
    branch_id: branchId,
    page: 1,
    limit: 20,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      inventoryQuery.refetch(),
      batchesQuery.refetch(),
      importsQuery.refetch(),
    ]);
    setRefreshing(false);
  };

  const renderInventoryTab = () => {
    if (inventoryQuery.isLoading && !inventoryQuery.data) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      );
    }

    const data = inventoryQuery.data?.data || [];

    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="pill" size={48} color="#9E9E9E" />
          <Text style={styles.emptyText}>Chưa có thuốc trong kho</Text>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {data.map(item => (
          <InventoryCard
            key={item._id}
            item={item}
            onPress={() => {
              navigation.navigate(ROUTES.INVENTORY_DETAIL_WITH_BATCHES, {
                medicineId: item.medicine?._id,
                branchId: branchId,
              });
            }}
          />
        ))}
      </View>
    );
  };

  const renderBatchesTab = () => {
    if (batchesQuery.isLoading && !batchesQuery.data) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      );
    }

    const data = batchesQuery.data?.data || [];

    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="package-box"
            size={48}
            color="#9E9E9E"
          />
          <Text style={styles.emptyText}>Chưa có lô hàng</Text>
        </View>
      );
    }

    // Group by status
    const groupedData = data.reduce((acc, batch) => {
      const status = batch.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(batch);
      return acc;
    }, {} as Record<string, any[]>);

    const sections = Object.entries(groupedData).map(([status, batches]) => ({
      title: `${status.toUpperCase()} (${batches.length})`,
      data: batches,
    }));

    return (
      <View style={styles.listContainer}>
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.data.map(item => {
              console.log('BranchInventoryManagementScreen: batch item =', {
                _id: item._id,
                batch_number: item.batch_number,
                fullItem: item,
              });
              return (
                <BatchCard
                  key={item._id}
                  batch={item}
                  onPress={() => {
                    console.log(
                      'BranchInventoryManagementScreen: onPress called',
                      {
                        _id: item._id,
                        hasId: !!item._id,
                      },
                    );
                    if (item._id) {
                      console.log(
                        'BranchInventoryManagementScreen: navigating with id =',
                        item._id,
                      );
                      navigation.navigate(ROUTES.BATCH_DETAIL, {
                        id: item._id,
                      });
                    } else {
                      console.error(
                        'BranchInventoryManagementScreen: item._id is missing!',
                        item,
                      );
                    }
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderImportsTab = () => {
    if (importsQuery.isLoading && !importsQuery.data) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      );
    }

    const data = importsQuery.data?.data || [];

    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="history" size={48} color="#9E9E9E" />
          <Text style={styles.emptyText}>Chưa có lịch sử nhập hàng</Text>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {data.map(item => (
          <ImportHistoryCard
            key={item._id}
            import={item}
            onPress={() => {
              navigation.navigate(ROUTES.IMPORT_DETAIL, { id: item._id });
            }}
          />
        ))}
      </View>
    );
  };

  const currentTab = activeTab;

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? '#4CAF50' : '#9E9E9E'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
          />
        }
      >
        {currentTab === 'inventory' && renderInventoryTab()}
        {currentTab === 'batches' && renderBatchesTab()}
        {currentTab === 'imports' && renderImportsTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4CAF50',
  },
  tabLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  sectionHeader: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
});
