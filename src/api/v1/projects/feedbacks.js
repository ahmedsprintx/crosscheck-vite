import client from 'api/axios-config';

export const getFeedbacks = (projectId, search) => {
  return client.get(`/api/feedbacks/get-feedbacks/${projectId}`, {
    params: {
      search,
    },
  });
};
export const deleteFeedBack = (body) => {
  return client.delete(`/api/feedbacks/delete-feedbacks`, {
    data: body,
  });
};
export const reportBugFromFeedback = ({ id, body }) => {
  return client.post(`/api/feedbacks/report-bug-from-feedback/${id}`, body);
};
