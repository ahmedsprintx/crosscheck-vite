import client from 'api/axios-config';

export const allBugsWithFilters = (filters) => {
  return client.post('/api/bugs/get-all-bugs', filters, {
    params: {
      search: filters.search || '',
      page: filters.page || 0,
      perPage: filters.perPage,
    },
  });
};
export const getBugById = (id) => {
  return client.get(`/api/bugs/get-bug/${id}`);
};
export const getBugSubtype = () => {
  return client.get(`/api/bugs/get-bug-subtypes`);
};
export const getTestedEnvironment = () => {
  return client.get(`/api/bugs/unique-tested-environments`);
};
export const getTestedDevices = () => {
  return client.get(`/api/bugs/unique-tested-devices`);
};

export const createBug = (body) => {
  return client.post('/api/bugs/add-bug', body);
};
export const updateBug = ({ id, body }) => {
  return client.put(`api/bugs/edit-bug/${id}`, body);
};
export const retestBug = ({ id, body }) => {
  return client.put(`/api/bugs/retest-bug/${id}`, body);
};

export const deleteBug = ({ body }) => {
  return client.delete(`/api/bugs/delete-bugs`, {
    data: body,
  });
};
export const changeSeverityOfBug = ({ id, body }) => {
  return client.put(`/api/bugs/change-severity/${id}`, body);
};
export const bulkEditBugs = ({ body }) => {
  return client.put(`/api/bugs/bulk-edit-bugs`, body);
};
// NOTE:   export const importBug = ({ body }) => {
// NOTE:     return client.post(`/api/test-cases/import-test-cases`, body);
// NOTE:   };

export const getComments = ({ bugId }) => {
  return client.get(`/api/comments/${bugId}`);
};

export const addComment = ({ body }) => {
  return client.post(`/api/comments/`, body);
};

export const editComment = ({ commentId, body }) => {
  return client.put(`/api/comments/${commentId}`, body);
};

export const deleteComment = ({ commentId }) => {
  return client.delete(`/api/comments/${commentId}`);
};

export const exportBugs = (filters) => {
  return client.post('/api/bugs/get-all-bugs', filters, {
    params: {
      search: filters.search || '',
      page: filters.page || 0,
      perPage: filters.perPage,
      isExporting: true,
    },
  });
};
