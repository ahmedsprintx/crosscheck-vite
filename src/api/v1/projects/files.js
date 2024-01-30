import client from 'api/axios-config';

export const getAllFiles = (projectId, search) => {
  return client.get(`/api/projects/get-project-files/${projectId}`, { params: { search } });
};

export const uploadProjectFile = ({ id, body }) => {
  return client.post(`/api/projects/upload-project-file/${id}`, body);
};
export const renameProjectFile = ({ id, body }) => {
  return client.put(`/api/projects/rename-project-file/${id}`, body);
};

export const deleteProjectFile = (id) => {
  return client.delete(`/api/projects/delete-uploaded-file/${id}`);
};
