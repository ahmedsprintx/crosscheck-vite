// NOTE: third party
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import {
  getUsers,
  deleteUser,
  createUser,
  getUserById,
  updateUser,
  updateUserPassword,
  updateStatus,
  updateAccount,
  verifyEmail,
  getUsersInfinite,
  darkMoodToggle,
  connectClickUp,
  updateUserRole,
  removeUser,
  inviteUser,
  updateClickup,
  changeWorkspace,
  getMyWorkspaces,
  getInvitees,
  updateWorkspace,
  deleteWorkspace,
  connectJira,
  connectGoogleDrive,
  connectOneDrive,
} from 'api/v1/settings/user-management';

// NOTE: hook's or api's
export function useGetUsers({ sortBy, sort, search, page, perPage, onSuccess = () => {} }) {
  return useQuery({
    queryKey: ['allUser', sortBy, sort, search, page, perPage],
    queryFn: () => getUsers({ sortBy, sort, search, page, perPage }),

    refetchOnWindowFocus: false,
    onSuccess,
  });
}

export function useGetInfiniteUsers({ sortBy, sort, search, page, perPage, getNextPageParam }) {
  return useInfiniteQuery({
    queryKey: ['paginatedDataForUsers', search, sortBy, sort, page],
    queryFn: () => {
      return getUsersInfinite({ page, sortBy, sort, search, perPage });
    },
    refetchOnWindowFocus: false,
    getNextPageParam,
  });
}

export function useGetUserById(id) {
  return useQuery({
    queryKey: `user${id}`,
    queryFn: () => getUserById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useDeleteUser() {
  return useMutation(deleteUser);
}
export function useCreateUser() {
  return useMutation(createUser);
}
export function useDarkMoodToggle() {
  return useMutation(darkMoodToggle);
}
export function useUpdateUser() {
  return useMutation(updateUser);
}
export function useUpdateUserPassword() {
  return useMutation(updateUserPassword);
}
export function useToggleUserStatus() {
  return useMutation(updateStatus);
}

export function useUpdateAccount() {
  return useMutation(updateAccount);
}
export function useDeleteWorkspace() {
  return useMutation(deleteWorkspace);
}
export function useUpdateWorkspace() {
  return useMutation(updateWorkspace);
}

export function useVerifyEmail() {
  return useMutation(verifyEmail);
}

export const useConnectClickUp = () => {
  return useMutation(connectClickUp);
};
export const useConnectJira = () => {
  return useMutation(connectJira);
};
export const useConnectGoogleDrive = () => {
  return useMutation(connectGoogleDrive);
};
export const useConnectOneDrive = () => {
  return useMutation(connectOneDrive);
};
export function useUpdateUserRole() {
  return useMutation(updateUserRole);
}
export function useRemoveUser() {
  return useMutation(removeUser);
}
export function useInviteUser() {
  return useMutation(inviteUser);
}
export const useUpdateClickUp = () => {
  return useMutation(updateClickup);
};
export const useChangeWorkspace = () => {
  return useMutation(changeWorkspace);
};

export const useGetMyWorkspaces = (signUpMode) => {
  return useQuery({
    queryKey: ['workspace'],
    queryFn: () => getMyWorkspaces(signUpMode),
    enabled: !!signUpMode,
    refetchOnWindowFocus: false,
  });
};
export const useGetInvitees = () => {
  return useMutation(getInvitees);
};
