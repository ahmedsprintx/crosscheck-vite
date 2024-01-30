import client from 'api/axios-config';

const activePlan =
  localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))?.activePlan;
export const getUsers = ({ sortBy, sort, search, page, perPage }) => {
  return client.get('/api/users/get-users', {
    params: {
      sortBy,
      sort,
      search,
      page: page || 0,
      perPage,
    },
  });
};
export const getUsersInfinite = ({ sortBy = '', sort = '', search = '', perPage, page }) => {
  return client.get('/api/users/get-users', {
    params: { sortBy, sort, search, page, perPage },
  });
};

export const getUserById = (id) => {
  return client.get(`/api/users/get-user-by-id/${id}`);
};

export const createUser = (body) => {
  return client.post('/api/users/add-user', body);
};
export const darkMoodToggle = (id) => {
  return client.put(`/api/users/dark-mode-toggle/${id}`);
};

export const updateUser = ({ id, body }) => {
  return client.put(`/api/users/edit-user/${id}`, body);
};

export const updateUserPassword = ({ id, body }) => {
  return client.put(`/api/users/change-password/${id}`, body);
};

export const updateStatus = ({ id, user }) => {
  return client.put(`/api/users/toggle/${id}`, user);
};

export const deleteUser = (id) => {
  return client.delete(`/api/users/delete-user/${id}`);
};

export const updateAccount = ({ body }) => {
  return client.put(`/api/users/account-setting`, body);
};
export const updateWorkspace = ({ body }) => {
  return client.put(`/api/auth/edit-workspace`, body);
};
export const deleteWorkspace = () => {
  return client.delete(`/api/auth/delete-workspace`);
};

export const verifyEmail = ({ id }) => {
  return client.put(`/api/users/verify-email-link/${id}`);
};

export const connectClickUp = (body) => {
  return activePlan ? client.post('/api/tasks/authorize-clickup-user', body) : ``;
};
export const connectJira = (body) => {
  return activePlan ? client.post('/api/tasks/authorize-jira-user', body) : ``;
};
export const connectGoogleDrive = (body) => {
  return activePlan ? client.post('/api/default-storage/integrate-google-drive', body) : ``;
};
export const connectOneDrive = (body) => {
  return activePlan ? client.post('/api/default-storage/integrate-one-drive', body) : ``;
};
export const updateUserRole = ({ id, body }) => {
  return client.put(`/api/users/change-role/${id}`, body);
};

export const removeUser = ({ body }) => {
  return client.post(`/api/users/remove-member`, body);
};

export const inviteUser = ({ body }) => {
  return client.post(`/api/users/invite-member`, body);
};

export const updateClickup = ({ id, body }) => {
  return client.put(`/api/users/change-clickup-id/${id}`, body);
};

export const changeWorkspace = (id) => {
  client.defaults.headers.common['last-accessed-workspace'] = id;

  return client.post(`/api/auth/change-workspace`);
};

export const getMyWorkspaces = (signUpMode) => {
  return signUpMode === 'AppAndExtension' && client.get(`/api/auth/my-workspaces`);
};
export const getInvitees = () => {
  return client.get(`/api/users/get-invitees`);
};
