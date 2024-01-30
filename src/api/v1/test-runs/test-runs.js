import client from 'api/axios-config';

export const allTestRunsWithFilters = (filters) => {
  return client.post('/api/test-runs/get-all-test-runs', filters, {
    params: {
      search: filters.search || '',
      page: filters.page || 0,
      perPage: filters.perPage,
    },
  });
};

export const deleteTestRun = ({ body }) => {
  return client.delete(`/api/test-runs/delete-test-run`, {
    data: body,
  });
};

// NOTE: export const getTestRunById = ({ id, tested }) => {
// NOTE:   return client.get(`/api/test-runs/get-test-run/${id}`, {
// NOTE:     params: {
// NOTE:       tested: tested || 'tested',
// NOTE:     },
// NOTE:   });
// NOTE: };

export const getTestRunById = ({ id, tested, search = '' }) => {
  const params = tested !== 'all' ? { tested, search } : { search };

  return client.get(`/api/test-runs/get-test-run/${id}`, { params });
};

export const createTestRun = (body) => {
  return client.post('/api/test-runs/add-test-run', body);
};

export const updateTestRun = ({ id, body }) => {
  return client.put(`/api/test-runs/edit-test-run/${id}`, body);
};
export const changePriority = ({ id, body }) => {
  return client.put(`/api/test-runs/change-priority/${id}`, body);
};

export const updateTestCaseOfRun = ({ id, body }) => {
  return client.put(`/api/test-runs/update-test-case-of-run/${id}`, body);
};

export const closeTestRun = (id) => {
  return client.put(`/api/test-runs/close-test-run/${id}`);
};

export const exportTestRuns = (filters) => {
  return client.post('/api/test-runs/get-all-test-runs', filters, {
    params: {
      search: filters.search || '',
      page: filters.page || 0,
      perPage: filters.perPage,
      isExporting: true,
    },
  });
};
