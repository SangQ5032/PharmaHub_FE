import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  usePayrollDetail,
  useApprovePayroll,
  useRejectPayroll,
  useUpdatePayroll,
} from '../hooks/usePayroll';
import { PayrollDetails } from '../components';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

interface PayrollDetailsScreenProps {
  payrollId?: string;
  token?: string;
  userRole?: string;
  onClose?: () => void;
}

export const PayrollDetailsScreen: React.FC<PayrollDetailsScreenProps> = ({
  payrollId: initialPayrollId,
  token: initialToken,
  userRole: initialUserRole,
  onClose,
}) => {
  const route = useRoute();
  const authUser = useAuthStore(state => state.user);
  const authToken = useAuthStore(state => state.accessToken);

  // Lấy payrollId từ route params hoặc props
  const payrollId = initialPayrollId || (route.params as any)?.payrollId;
  const token = initialToken || authToken || '';
  const userRole = initialUserRole || authUser?.role || 'employee';

  const [actionNote, setActionNote] = useState('');

  // Queries
  const { data: detailResponse, isLoading } = usePayrollDetail(payrollId);
  const payroll = detailResponse?.data;

  // Mutations
  const { mutate: approve, isPending: approvingLoading } = useApprovePayroll();
  const { mutate: reject, isPending: rejectingLoading } = useRejectPayroll();

  const canApprove =
    userRole === 'system-admin' && payroll?.status === 'pending';
  const canReject =
    userRole === 'system-admin' && payroll?.status === 'pending';

  const handleApprove = () => {
    if (!payroll) return;

    approve(
      { payrollId: payroll._id, data: { note: actionNote } },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Duyệt lương thành công', [
            {
              text: 'OK',
              onPress: onClose,
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            'Lỗi',
            error?.response?.data?.message || 'Duyệt lương thất bại',
          );
        },
      },
    );
  };

  const handleReject = (reason?: string) => {
    if (!payroll) return;

    reject(
      { payrollId: payroll._id, data: { reason: reason || '' } },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Từ chối lương thành công', [
            {
              text: 'OK',
              onPress: onClose,
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            'Lỗi',
            error?.response?.data?.message || 'Từ chối lương thất bại',
          );
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <PayrollDetails
        payroll={payroll || null}
        loading={isLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        canApprove={canApprove}
        canReject={canReject}
        approvingLoading={approvingLoading}
        rejectingLoading={rejectingLoading}
        userRole={userRole}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
