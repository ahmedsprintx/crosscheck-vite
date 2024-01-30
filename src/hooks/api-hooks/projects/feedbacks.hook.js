import { deleteFeedBack, getFeedbacks, reportBugFromFeedback } from 'api/v1/projects/feedbacks';
import { useMutation, useQuery } from 'react-query';

export function useGetFeedBacks({ projectId, search }) {
  return useQuery({
    queryKey: ['getFeedbacks', projectId, search],
    queryFn: () => getFeedbacks(projectId, search),
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
}
export function useDeleteFeedBacks() {
  return useMutation(deleteFeedBack);
}
export function useReportBugFromFeedBack() {
  return useMutation(reportBugFromFeedback);
}
