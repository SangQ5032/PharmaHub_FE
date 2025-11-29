/**
 * Screen cho Branch Manager - Xem lịch sử làm việc nhân viên trong chi nhánh
 */
import React, { useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { WorkHistoryList } from '@features/work-schdule/components/WorkHistoryList';
import { WorkHistoryFilter } from '@features/work-schdule/components/WorkHistoryFilter';
import { useBranchEmployeesWorkHistory } from '@features/work-schdule/hooks/useWorkScheduleHistory';
import { WorkHistoryFilters } from '@features/work-schdule/types/workScheduleHistory.types';

export const BranchWorkHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const [filters, setFilters] = useState<WorkHistoryFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError, refetch } =
    useBranchEmployeesWorkHistory(filters);

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
