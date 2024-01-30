import {
  allTestCasesWithFilters,
  bulkEditTestCases,
  createTestCase,
  deleteTestCase,
  exportTestCases,
  getTestCaseById,
  importTestCases,
  updateOrderTestCase,
  updateStatusTestCase,
  updateTestCase,
} from 'api/v1/test-cases/test-cases';
import { useQuery, useMutation } from 'react-query';

export const useGetTestCasesByFilter = () => {
  return useMutation(allTestCasesWithFilters);
};

export const useGetTestCaseById = (id) => {
  return useQuery({
    queryKey: ['testCase', id],
    queryFn: () => getTestCaseById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTestCase = () => {
  return useMutation(createTestCase);
};
export const useUpdateTestCase = () => {
  return useMutation(updateTestCase);
};
export const useUpdateOrderTestCase = () => {
  return useMutation(updateOrderTestCase);
};

export const useUpdateStatusTestCase = () => {
  return useMutation(updateStatusTestCase);
};
export const useDeleteTestCase = () => {
  return useMutation(deleteTestCase);
};
export const useImportTestCase = () => {
  return useMutation(importTestCases);
};
export const useBulkEditTestCase = () => {
  return useMutation(bulkEditTestCases);
};

export const useExportTestCases = () => {
  return useMutation(exportTestCases);
};
