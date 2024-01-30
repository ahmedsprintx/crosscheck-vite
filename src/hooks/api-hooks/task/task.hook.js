import {
  allMembers,
  allTasksWithFilters,
  createJiraTask,
  createTask,
  getJiraProjects,
  getJiraSites,
  getLocation,
  issueType,
  jiraUsers,
  refreshToken,
} from 'api/v1/task/task';
import { useMutation } from 'react-query';

export const useGetLocation = () => {
  return useMutation(getLocation);
};
export const useGetJiraSites = () => {
  return useMutation(getJiraSites);
};

export const useGetAllMembers = () => {
  return useMutation(allMembers);
};

export const useCreateTask = () => {
  return useMutation(createTask);
};
export const useCreateJiraTask = () => {
  return useMutation(createJiraTask);
};

// NOTE: export const useGetTasksByFilter = () => {
// NOTE:   return useMutation(allTasksWithFilters);
// NOTE: };

export const useGetTasksByFilter = () => {
  return useMutation(allTasksWithFilters);
};

export const useRefreshToken = () => {
  return useMutation(refreshToken);
};
export const useJiraProjects = () => {
  return useMutation(getJiraProjects);
};
export const useGetIssuesType = () => {
  return useMutation(issueType);
};
export const useGetJiraUsers = () => {
  return useMutation(jiraUsers);
};
