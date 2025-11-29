/**
 * Screen cho System Admin - Xem lịch sử làm việc tất cả các chi nhánh
 */
import React, { useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { WorkHistoryList } from '@features/work-schdule/components/WorkHistoryList';
import { WorkHistoryFilter } from '@features/work-schdule/components/WorkHistoryFilter';
import { useAllWorkHistory } from '@features/work-schdule/hooks/useWorkScheduleHistory';
import { WorkHistoryFilters } from '@features/work-schdule/types/workScheduleHistory.types';

export const AdminWorkHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const [filters, setFilters] = useState<WorkHistoryFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError, refetch } = useAllWorkHistory(filters);

  // Refetch khi screen được focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleFilterChange = (newFilters: WorkHistoryFilters) => {
    setFilters(newFilters);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <WorkHistoryFilter
        filters={filters}
        onFiltersChange={handleFilterChange}
        showUserFilter={true}
        showBranchFilter={true}
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
});
