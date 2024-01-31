import { allTrash, deleteAllTrash, deleteTrash, restoreAllTrash, restoreTrash } from 'api/v1/trash/trash';
import { useMutation } from 'react-query';

export const useGetAllTrash = () => {
  return useMutation(allTrash);
};

export const useDeleteTrashSingle = () => {
  return useMutation(deleteTrash);
};

export const useDeleteTrashAll = () => {
  return useMutation(deleteAllTrash);
};

export const useRestoreTrashSingle = () => {
  return useMutation(restoreTrash);
};

export const useRestoreTrashAll = () => {
  return useMutation(restoreAllTrash);
};
