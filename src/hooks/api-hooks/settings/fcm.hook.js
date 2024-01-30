import { updateFCMToken } from 'api/v1/settings/fcm';
import { useMutation } from 'react-query';

export function useUpdateFCMToken() {
  return useMutation(updateFCMToken);
}
