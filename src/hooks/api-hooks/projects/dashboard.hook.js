import {
  addShareableLink,
  bugsReported,
  editShareableLink,
  getAnalytics,
  getBugsAging,
  getBugsReporter,
  getBugsSeverity,
  getBugsStatus,
  getBugsTypes,
  getDevelopersBug,
  profileTestCasesSummaryMilleStoneWise,
  shareableWidget,
  testCasesSummaryMilleStoneWise,
} from 'api/v1/projects/dashboard';
import { useMutation, useQuery } from 'react-query';

// NOTE: hook's or api's
export function useTestCasesSummaryMilleStoneWise(id) {
  return useQuery({
    queryKey: ['testCasesSummaryMilleStoneWise', id],
    queryFn: () => testCasesSummaryMilleStoneWise(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
export function useProfileTestCasesSummaryMilleStoneWise(id) {
  return useQuery({
    queryKey: ['profileTestCasesSummaryMilleStoneWise', id],
    queryFn: () => profileTestCasesSummaryMilleStoneWise(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
export function useBugsReported({ id, filters }) {
  return useQuery({
    queryKey: ['bugsReported', id, filters?.startDate, filters?.endDate],
    queryFn: () => bugsReported({ id, filters }),
    enabled: !!id && !!filters?.startDate && !!filters?.endDate,
    refetchOnWindowFocus: false,
  });
}
export function useAddShareableLink() {
  return useMutation(addShareableLink);
}
export function useEditShareableLink() {
  return useMutation(editShareableLink);
}
export function useShareableWidget() {
  return useMutation(shareableWidget);
}

export const useGetBugsStatus = () => {
  return useMutation(getBugsStatus);
};
export const useGetBugsTypes = () => {
  return useMutation(getBugsTypes);
};
export const useGetBugsSeverity = () => {
  return useMutation(getBugsSeverity);
};

export const useGetAnalytics = () => {
  return useMutation(getAnalytics);
};
export const useGetBugsAging = () => {
  return useMutation(getBugsAging);
};
export const useBugReporter = () => {
  return useMutation(getBugsReporter);
};
export const useDevelopersBug = () => {
  return useMutation(getDevelopersBug);
};
