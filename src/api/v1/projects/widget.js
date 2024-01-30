import client from 'api/axios-config';

const activePlan = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));

export const getWidgetConfig = (id) => {
  return activePlan !== 'Free'
    ? client.get(`/api/embed-widget/get-widget-configurations/${id}`)
    : ``;
};
export const addWidgetConfig = (body) => {
  return activePlan !== 'Free'
    ? client.post(`/api/embed-widget/store-widget-configurations`, body)
    : ``;
};
export const editWidgetConfig = ({ id, body }) => {
  return activePlan !== 'Free'
    ? client.put(`/api/embed-widget/update-widget-configurations/${id}`, body)
    : ``;
};
