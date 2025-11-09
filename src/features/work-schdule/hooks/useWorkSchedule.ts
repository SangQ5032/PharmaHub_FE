import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workScheduleApi } from '@features/work-schdule/api/work-schedule.api';
import { CreateWorkScheduleBody } from '@features/work-schdule/types/types';

export function useWorkSchedules() {
  return useQuery({
    queryKey: ['work-schedules'],
    queryFn: () => workScheduleApi.getAll(),
  });
}

export function useMyWorkSchedule() {
  return useQuery({
    queryKey: ['work-schedules', 'my-schedule'],
    queryFn: () => workScheduleApi.getMySchedule(),
  });
}

export function useCreateWorkSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateWorkScheduleBody) => workScheduleApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
    },
  });
}
