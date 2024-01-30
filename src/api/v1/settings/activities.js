import client from 'api/axios-config';

const activePlan =
  localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))?.activePlan;

export const getActivities = (filters) => {
  return activePlan !== 'Free'
    ? client.post('/api/activities/get-all-activities', filters, {
        params: {
          page: filters?.page || 0,
          perPage: filters?.perPage || 25,
        },
      })
    : ``;
};
