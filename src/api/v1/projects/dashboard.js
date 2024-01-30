import client from 'api/axios-config';

export const testCasesSummaryMilleStoneWise = (id) => {
  return client.get(`/api/widgets/milestone-test-cases-summary/${id}`);
};
export const profileTestCasesSummaryMilleStoneWise = (id) => {
  return client.get(`/api/widgets/feature-test-cases-summary/${id}`);
};
export const bugsReported = ({ id, filters }) => {
  return client.get(`/api/widgets/bugs-reported-widget/${id}`, { params: filters });
};
export const addShareableLink = (body) => {
  return client.post(`/api/shared/store-shareable-link`, body);
};
export const editShareableLink = (body) => {
  return client.put(`/api/shared/update-shareable-link`, body);
};
export const shareableWidget = (body) => {
  return client.post(`/api/shared/bugs-widget`, body);
};

export const getBugsStatus = ({ id, filters }) => {
  return client.post(`/api/widgets/bugs-status-widget/${id}`, filters);
};

export const getBugsTypes = ({ id, filters }) => {
  return client.post(`/api/widgets/bugs-types-widget/${id}`, filters);
};
export const getBugsSeverity = ({ id, filters }) => {
  return client.post(`/api/widgets/bugs-severity-widget/${id}`, filters);
};

export const getAnalytics = (id) => {
  return client.get(`/api/widgets/overall-analytics-widget/${id}`);
};

export const getBugsAging = (id) => {
  return client.get(`/api/widgets/bugs-aging-widget/${id}`);
};
export const getBugsReporter = ({ id, filters }) => {
  return client.post(`/api/widgets/bugs-reporter-widget/${id}`, filters);
};
export const getDevelopersBug = ({ id, filters }) => {
  return client.post(`/api/widgets/developer-bugs-widget/${id}`, filters);
};
