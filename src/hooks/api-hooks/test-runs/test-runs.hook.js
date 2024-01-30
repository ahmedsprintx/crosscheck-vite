import {
  allTestRunsWithFilters,
  changePriority,
  closeTestRun,
  createTestRun,
  deleteTestRun,
  exportTestRuns,
  getTestRunById,
  updateTestCaseOfRun,
  updateTestRun,
} from 'api/v1/test-runs/test-runs';
import { useQuery, useMutation } from 'react-query';

export const useGetTestRunsByFilter = () => {
  return useMutation(allTestRunsWithFilters);
};

export const useDeleteTestRun = () => {
  return useMutation(deleteTestRun);
};

// NOTE: export const useGetTestRunById = (id) => {
// NOTE:   return useQuery({
// NOTE:     queryKey: ['testRun', id],
// NOTE:     queryFn: () => getTestRunById({ id }),
// NOTE:     enabled: !!id,
// NOTE:     refetchOnWindowFocus: false,
// NOTE:   });
// NOTE: };
export const useGetTestRunById = ({ id, tested, search }) => {
  return useQuery({
    queryKey: ['testRun', id, tested, search],
    queryFn: () => getTestRunById({ id, tested, search }),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTestRun = () => {
  return useMutation(createTestRun);
};
export const useChangePriorityTestRun = () => {
  return useMutation(changePriority);
};

export const useUpdateTestRun = () => {
  return useMutation(updateTestRun);
};
export const useUpdateTestCaseOfRun = () => {
  return useMutation(updateTestCaseOfRun);
};

export const useCloseTestRuns = () => {
  return useMutation(closeTestRun);
};

export const useExportTestRuns = () => {
  return useMutation(exportTestRuns);
};
