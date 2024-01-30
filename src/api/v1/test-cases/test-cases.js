import client from 'api/axios-config';

const activePlan = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));

export const allTestCasesWithFilters = (filters) => {
  return client.post('/api/test-cases/get-all-test-cases', filters, {
    params: {
      search: filters.search || '',
      page: filters.page || 0,
      perPage: filters.perPage,
    },
  });
};
export const getTestCaseById = (id) => {
  return client.get(`/api/test-cases/get-test-case/${id}`);
};

export const createTestCase = (body) => {
  return client.post('/api/test-cases/add-test-case', body);
};
export const updateTestCase = ({ id, body }) => {
  return client.put(`/api/test-cases/edit-test-case/${id}`, body);
};
export const updateStatusTestCase = ({ id, body }) => {
  return client.put(`/api/test-cases/update-test-case-status/${id}`, body);
};

export const deleteTestCase = ({ body }) => {
  return client.delete(`/api/test-cases/delete-test-cases`, {
    data: body,
  });
};
export const updateOrderTestCase = ({ id, body }) => {
  return client.put(`/api/test-cases/re-order-test-cases/${id}`, body);
};
export const importTestCases = ({ body }) => {
  return activePlan !== 'Free' ? client.post(`/api/test-cases/import-test-cases`, body) : ``;
};
export const bulkEditTestCases = ({ body }) => {
  return client.put(`/api/test-cases/bulk-edit-test-cases`, body);
};

export const exportTestCases = (filters) => {
  return client.post('/api/test-cases/get-all-test-cases', filters, {
    params: {
      search: filters.search || '',
      page: filters.page || 0,
      perPage: filters.perPage,
      isExporting: true,
    },
  });
};
