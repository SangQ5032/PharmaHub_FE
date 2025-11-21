import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workScheduleApi } from '@features/work-schdule/api/work-schedule.api';
import {
  CreateWorkScheduleBody,
  UpdateWorkScheduleBody,
  CreateDayScheduleBody,
  CreateWeekScheduleBody,
  GetWeekScheduleParams,
  GetDayScheduleParams,
} from '@features/work-schdule/types/types';

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

export function useWorkScheduleByBranch(branchId: string) {
  return useQuery({
    queryKey: ['work-schedules', 'branch', branchId],
    queryFn: () => workScheduleApi.getByBranch(branchId),
    enabled: !!branchId,
  });
}

export function useWorkScheduleById(id: string) {
  return useQuery({
    queryKey: ['work-schedules', id],
    queryFn: () => workScheduleApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateWorkSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateWorkScheduleBody) => workScheduleApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['work-schedules', 'my-schedule'],
      });
    },
  });
}

export function useUpdateWorkSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateWorkScheduleBody }) =>
      workScheduleApi.update(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['work-schedules', 'my-schedule'],
      });
      queryClient.invalidateQueries({ queryKey: ['work-schedules', id] });
    },
  });
}

export function useDeleteWorkSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workScheduleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['work-schedules', 'my-schedule'],
      });
    },
  });
}

export function useCreateDaySchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateDayScheduleBody) =>
      workScheduleApi.createDaySchedule(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['work-schedules', 'my-schedule'],
      });
    },
  });
}

export function useCreateWeekSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateWeekScheduleBody) =>
      workScheduleApi.createWeekSchedule(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
      queryClient.invalidateQueries({
        queryKey: ['work-schedules', 'my-schedule'],
      });
    },
  });
}

export function useWeekSchedule(params: GetWeekScheduleParams) {
  return useQuery({
    queryKey: [
      'work-schedules',
      'week',
      params.branch_id,
      params.from,
      params.to,
    ],
    queryFn: () => workScheduleApi.getWeekSchedule(params),
    enabled: !!(params.branch_id && params.from && params.to),
  });
}

export function useDaySchedule(params: GetDayScheduleParams) {
  return useQuery({
    queryKey: ['work-schedules', 'day', params.branch_id, params.date],
    queryFn: () => workScheduleApi.getDaySchedule(params),
    enabled: !!(params.branch_id && params.date),
  });
}
