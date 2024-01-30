import client from 'api/axios-config';

export const getAllProjects = (filter) => {
  return client.get('/api/projects/get-all-projects', {
    params: filter,
  });
};
export const getAllProjectsMilestonesFeatures = () => {
  return client.get('/api/projects/get-all-projects-milestones-features');
};

export const getProjectById = (id) => {
  return client.get(`/api/projects/get-project/${id}`);
};

export const createProject = ({ body }) => {
  return client.post(`/api/projects/add-project`, body);
};

export const updateProject = ({ id, body }) => {
  return client.put(`/api/projects/edit-project/${id}`, body);
};

export const deleteProject = ({ id, body }) => {
  return client.delete(`/api/projects/delete-project/${id}`, body);
};

export const projectArchiveToggle = (id) => {
  return client.put(`/api/projects/archive-toggle/${id}`);
};

export const projectFavoriteToggle = (id) => {
  return client.put(`/api/projects/favorites-toggle/${id}`);
};
export const addNewMembersInProject = ({ id, body }) => {
  return client.put(`/api/projects/add-members/${id}`, body);
};

export const membersToDeleteFromProject = ({ id, body }) => {
  return client.put(`/api/projects/remove-member/${id}`, body);
};
