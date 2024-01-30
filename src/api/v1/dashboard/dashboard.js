import client from 'api/axios-config';

const activePlan = JSON.parse(localStorage.getItem('user'))?.activePlan;

export const getQaReport = (filters) => {
  return activePlan !== 'Free' ? client.post('api/reports/get-qa-reports', filters) : ``;
};

export const getDevReport = (filters) => {
  return activePlan !== 'Free' ? client.post('/api/widgets/developer-reports', filters) : ``;
};

export const getOverallAnalytics = () => {
  return client.get(`/api/widgets/admin-analytics-widget/`);
};

// NOTE: Developer Dashboard

export const getDevAnalytics = () => {
  return client.get(`/api/widgets/developer-analytics-widget`);
};

export const getHighSeverityBugsWidget = ({ page, perPage }) => {
  return client.get('/api/widgets/high-severity-bugs-widget', {
    params: {
      page: page || 0,
      perPage,
    },
  });
};

export const getReproducibleBugsWidget = ({ page, perPage }) => {
  return client.get('/api/widgets/recent-reproducible-bugs-widget', {
    params: {
      page: page || 0,
      perPage,
    },
  });
};

export const getAssignedBugsWidget = ({ page, perPage }) => {
  return client.get('/api/widgets/recent-assigned-bugs-widget', {
    params: {
      page: page || 0,
      perPage,
    },
  });
};

export const getOpenedBugsWidget = ({ page, perPage }) => {
  return client.get('/api/widgets/recent-opened-bugs-widget', {
    params: {
      page: page || 0,
      perPage,
    },
  });
};

// NOTE: QA Dashboard

export const getQaAnalytics = () => {
  return client.get(`/api/widgets/qa-analytics-widget/`);
};

export const getMyReportedBugsWidget = ({ page, perPage }) => {
  return client.get('/api/widgets/qa-reported-bugs-widget', {
    params: {
      page: page || 0,
      perPage,
    },
  });
};
