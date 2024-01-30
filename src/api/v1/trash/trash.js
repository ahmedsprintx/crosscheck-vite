import client from 'api/axios-config';

const activePlan = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));

// NOTE: export const allTrash = () => {
// NOTE:   return client.get('/api/trash/get-all-trash');
// NOTE: };

export const allTrash = (body) => {
  return activePlan !== 'Free' ? client.post('/api/trash/get-all-trash', body) : ``;
};

export const deleteTrash = ({ id, body }) => {
  return client.delete(`/api/trash/remove-one-from-trash/${id}`, {
    data: body,
  });
};

export const deleteAllTrash = () => {
  return client.delete(`/api/trash/clear-all-trash`);
};

export const restoreTrash = ({ id, body }) => {
  return client.put(`/api/trash/restore-one-from-trash/${id}`, body);
};

export const restoreAllTrash = (id) => {
  return client.put(`/api/trash/restore-all-trash`);
};
