import client from 'api/axios-config';

export const updateFCMToken = (body) => {
  return client.put('/api/users/update-fcm-token', body);
};
