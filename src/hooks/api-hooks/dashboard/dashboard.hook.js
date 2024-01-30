import {
  getDevAnalytics,
  getReproducibleBugsWidget,
  getHighSeverityBugsWidget,
  getQaReport,
  getAssignedBugsWidget,
  getOpenedBugsWidget,
  getQaAnalytics,
  getMyReportedBugsWidget,
  getDevReport,
  getOverallAnalytics,
} from 'api/v1/dashboard/dashboard';
import { useQuery, useMutation } from 'react-query';

// NOTE: Admin Dashboard

export const useGetQaReport = () => {
  return useMutation(getQaReport);
};
export const useGetDevReport = () => {
  return useMutation(getDevReport);
};
export const useGetOverallAnalytics = () => {
  return useMutation(getOverallAnalytics);
};
// NOTE: Developer Dashboard

export const useGetDevAnalytics = () => {
  return useMutation(getDevAnalytics);
};

export function useGetHighSeverityBugsWidget({ page, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['highSeverityBugs', page, perPage],
    queryFn: () => getHighSeverityBugsWidget({ page, perPage }),
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetReproducibleBugsWidget({ page, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['reproducibleBugs', page, perPage],
    queryFn: () => getReproducibleBugsWidget({ page, perPage }),
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetAssignedBugsWidget({ page, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['assignedBugs', page, perPage],
    queryFn: () => getAssignedBugsWidget({ page, perPage }),
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetOpenedBugsWidget({ page, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['openedBugs', page, perPage],
    queryFn: () => getOpenedBugsWidget({ page, perPage }),
    refetchOnWindowFocus: false,
    onSuccess,
  });
}

// NOTE: Qa Dashboard

export const useGetQaAnalytics = () => {
  return useMutation(getQaAnalytics);
};

export function useGetMyReportedBugsWidget({ page, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['MyReportedBugs', page, perPage],
    queryFn: () => getMyReportedBugsWidget({ page, perPage }),
    refetchOnWindowFocus: false,
    onSuccess,
  });
}
