import {
  addMilestone,
  deleteMilestone,
  editMilestone,
  milestonePerProject,
  updateMilestoneOrder,
} from 'api/v1/milestone/milestone';
import { useQuery, useMutation } from 'react-query';

export function useMilestonePerProject(id) {
  return useQuery({
    queryKey: ['milestonePerProject', id],
    queryFn: async () => milestonePerProject(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useAddMilestone() {
  return useMutation(addMilestone);
}
export function useEditMilestone() {
  return useMutation(editMilestone);
}
export function useDeleteMilestone() {
  return useMutation(deleteMilestone);
}

export function useUpdateOrderMilestone() {
  return useMutation(updateMilestoneOrder);
}
