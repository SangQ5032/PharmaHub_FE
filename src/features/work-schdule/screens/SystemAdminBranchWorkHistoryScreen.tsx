import React, { useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { WorkHistoryList } from '@features/work-schdule/components/WorkHistoryList';
import { WorkHistoryFilter } from '@features/work-schdule/components/WorkHistoryFilter';
import { useAllWorkHistory } from '@features/work-schdule/hooks/useWorkScheduleHistory';
import { WorkHistoryFilters } from '@features/work-schdule/types/workScheduleHistory.types';

export const SystemAdminBranchWorkHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute();
  const branchId = (route.params as any)?.branchId || '';
  const branchName = (route.params as any)?.branchName || 'Chi nhánh';

  const [filters, setFilters] = useState<WorkHistoryFilters>({
    page: 1,
    limit: 10,
    branchId: branchId, // Set branch_id from route params
  });

  const { data, isLoading, isError, refetch } = useAllWorkHistory(filters);

  // Update filters when branchId changes
  React.useEffect(() => {
    if (branchId) {
      setFilters(prev => ({ ...prev, branchId }));
    }
  }, [branchId]);

  // Refetch khi screen được focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleFilterChange = (newFilters: WorkHistoryFilters) => {
    setFilters({ ...newFilters, branchId }); // Always keep branchId
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.branchHeader}>
        <Text style={styles.branchTitle}>{branchName}</Text>
      </View>
      <WorkHistoryFilter
        filters={filters}
        onFiltersChange={handleFilterChange}
        showUserFilter={true}
        showBranchFilter={false} // Hide branch filter since we're already filtering by branch
      />
      <WorkHistoryList
        data={data?.data}
        isLoading={isLoading}
        isError={isError}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  branchHeader: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  branchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});
