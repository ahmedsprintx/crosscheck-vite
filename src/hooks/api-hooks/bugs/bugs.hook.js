import {
  allBugsWithFilters,
  createBug,
  deleteBug,
  getBugById,
  retestBug,
  updateBug,
  changeSeverityOfBug,
  bulkEditBugs,
  addComment,
  editComment,
  getComments,
  deleteComment,
  exportBugs,
} from 'api/v1/bugs/bugs';
import { useQuery, useMutation } from 'react-query';

export const useGetBugsByFilter = () => {
  return useMutation(allBugsWithFilters);
};

export const useGetBugById = (id) => {
  return useQuery({
    queryKey: ['bug', id],
    queryFn: () => getBugById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateBug = () => {
  return useMutation(createBug);
};
export const useUpdateBug = () => {
  return useMutation(updateBug);
};
export const useRetestBug = () => {
  return useMutation(retestBug);
};

export const useUpdateSeverityBug = () => {
  return useMutation(changeSeverityOfBug);
};
export const useDeleteBug = () => {
  return useMutation(deleteBug);
};
export const useBulkEditBugs = () => {
  return useMutation(bulkEditBugs);
};
// NOTE:   export const useImportBug = () => {
// NOTE:     return useMutation(importBugs);
// NOTE:   };

export const useGetComments = (bugId) => {
  return useQuery({
    queryKey: ['comments', bugId],
    queryFn: () => getComments({ bugId }),
    enabled: !!bugId,
    refetchOnWindowFocus: false,
  });
};

export const useAddComment = () => {
  return useMutation(addComment);
};
export const useEditComment = () => {
  return useMutation(editComment);
};
export const useDeleteComment = () => {
  return useMutation(deleteComment);
};

export const useExportBugs = () => {
  return useMutation(exportBugs);
};
