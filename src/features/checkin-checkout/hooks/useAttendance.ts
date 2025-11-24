import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@features/checkin-checkout/api/attendance.api';
import {
  CheckinBody,
  CheckoutBody,
} from '@features/checkin-checkout/types/types';

export function useMyAttendance() {
  return useQuery({
    queryKey: ['attendance', 'my-attendance'],
    queryFn: () => attendanceApi.getMyAttendance(),
    retry: 1,
  });
}

/**
 * Hook để checkin - Yêu cầu latitude và longitude
 */
export function useCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CheckinBody) => attendanceApi.checkin(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error: any) => {
      // Xử lý lỗi từ API
      console.error('Checkin error:', error);
    },
  });
}

/**
 * Hook để checkout
 */
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CheckoutBody = {}) => attendanceApi.checkout(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error: any) => {
      // Xử lý lỗi từ API
      console.error('Checkout error:', error);
    },
  });
}
