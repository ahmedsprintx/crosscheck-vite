import {
  createProject,
  getAllProjects,
  getProjectById,
  projectFavoriteToggle,
  updateProject,
  projectArchiveToggle,
  membersToDeleteFromProject,
  deleteProject,
  addNewMembersInProject,
} from 'api/v1/projects/projects';
import { useMutation, useQuery } from 'react-query';

// NOTE: hook's or api's
export function useGetProjects(filter) {
  return useQuery({
    queryKey: ['allProjects', filter],
    queryFn: () => getAllProjects(filter),

    refetchOnWindowFocus: false,
  });
}
export function useGetProjectsForMainWrapper(filter, icon) {
  return useQuery({
    queryKey: ['allProjects', filter, icon],
    queryFn: () => getAllProjects(filter),
    enabled: !!icon,
    refetchOnWindowFocus: false,
  });
}
export function useGetProjectById(id) {
  return useQuery({
    queryKey: ['project', id],
    enabled: !!id,
    queryFn: () => getProjectById(id),

    refetchOnWindowFocus: false,
  });
}

export function useCreateProject() {
  return useMutation(createProject);
}
export function useUpdateProject() {
  return useMutation(updateProject);
}
export function useDeleteProject() {
  return useMutation(deleteProject);
}

export function useFavoritesToggle() {
  return useMutation(projectFavoriteToggle);
}
export function useArchiveToggle() {
  return useMutation(projectArchiveToggle);
}

export function useAddMembers() {
  return useMutation(addNewMembersInProject);
}
export function useDeleteMembers() {
  return useMutation(membersToDeleteFromProject);
}
