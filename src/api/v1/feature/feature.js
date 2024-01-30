import client from 'api/axios-config';

export const featurePerMilestone = (id) => {
  return client.get(`/api/features/get-all-features/${id}`);
};

export const addFeature = (body) => {
  return client.post(`/api/features/add-feature`, body);
};
export const editFeature = ({ id, body }) => {
  return client.put(`/api/features/edit-feature/${id}`, body);
};

export const deleteFeature = ({ id, body }) => {
  return client.delete(`/api/features/delete-feature/${id}`, body);
};

export const updateFeatureOrder = ({ id, body }) => {
  return client.put(`/api/features/update-feature-order/${id}`, body);
};
export const movetoFeature = ({ id, body }) => {
  return client.put(`/api/features/move-feature/${id}`, body);
};
