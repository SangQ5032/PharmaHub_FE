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
  });
}

export function useCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CheckinBody = {}) => attendanceApi.checkin(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CheckoutBody = {}) => attendanceApi.checkout(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}
