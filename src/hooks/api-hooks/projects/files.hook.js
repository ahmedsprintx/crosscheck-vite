import {
  getAllFiles,
  uploadProjectFile,
  renameProjectFile,
  deleteProjectFile,
} from 'api/v1/projects/files';
import { useQuery, useMutation } from 'react-query';

export function useGetProjectFiles({ projectId, search }) {
  return useQuery({
    queryKey: ['files', projectId, search],
    queryFn: () => getAllFiles(projectId, search),
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
}

export function useUploadProjectFiles() {
  return useMutation(uploadProjectFile);
}
export function useRenameProjectFile() {
  return useMutation(renameProjectFile);
}
export function useDeleteProjectFile() {
  return useMutation(deleteProjectFile);
}
