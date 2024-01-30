import client from 'api/axios-config';

export const getLocation = () => {
  return client.get(`/api/tasks/get-location`);
};
export const allMembers = (listId) => {
  return client.get('/api/tasks/get-members', {
    params: {
      listId: listId || '',
    },
  });
};
export const createTask = (body) => {
  return client.post('/api/tasks/create-task', body);
};
export const createJiraTask = ({ id, body }) => {
  return client.post(`/api/tasks/create-jira-issue/${id}`, body);
};
export const allTasksWithFilters = ({ id, filters }) => {
  return client.post(`/api/tasks/project-tasks/${id}`, filters, {
    params: {
      search: filters.search || '',
      page: filters.page || 0,
      perPage: filters.perPage,
    },
  });
};

export const getJiraSites = () => {
  return client.get(`/api/tasks/get-jira-sites`);
};

export const refreshToken = () => {
  return client.post(`/api/tasks/refresh-jira-token`);
};

export const getJiraProjects = (id) => {
  return client.get(`api/tasks/get-jira-site-projects/${id}`);
};
export const issueType = ({ id, projectId }) => {
  return client.get(`/api/tasks/get-issue-type-for-a-project/${id}`, {
    params: {
      projectId: projectId || '',
    },
  });
};

export const jiraUsers = ({ id, projectId }) => {
  return client.get(`/api/tasks/get-members-for-a-project/${id}`, {
    params: {
      projectId: projectId || '',
    },
  });
};
