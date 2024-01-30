import client from 'api/axios-config';

export const milestonePerProject = (id) => {
  return client.get(`/api/milestones/get-all-milestones/${id}`);
};

export const addMilestone = (body) => {
  return client.post(`/api/milestones/add-milestone`, body);
};
export const editMilestone = ({ id, body }) => {
  return client.put(`/api/milestones/edit-milestone/${id}`, body);
};

export const deleteMilestone = ({ id, body }) => {
  return client.delete(`/api/milestones/delete-milestone/${id}`, body);
};

export const updateMilestoneOrder = ({ id, body }) => {
  return client.put(`/api/milestones/update-milestone-order/${id}`, body);
};
