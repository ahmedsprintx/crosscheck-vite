import {
  addFeature,
  deleteFeature,
  editFeature,
  featurePerMilestone,
  movetoFeature,
  updateFeatureOrder,
} from 'api/v1/feature/feature';
import { useQuery, useMutation } from 'react-query';

export function useFeaturePerMileStone(id) {
  return useQuery({
    queryKey: ['featurePerProject', id],
    queryFn: async () => featurePerMilestone(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useAddFeature() {
  return useMutation(addFeature);
}
export function useEditFeature() {
  return useMutation(editFeature);
}
export function useDeleteFeature() {
  return useMutation(deleteFeature);
}
export function useUpdateOrderFeature() {
  return useMutation(updateFeatureOrder);
}
export function useMovetoFeature() {
  return useMutation(movetoFeature);
}
