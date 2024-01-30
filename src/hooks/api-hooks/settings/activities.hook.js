import { useMutation } from 'react-query';
import { getActivities } from 'api/v1/settings/activities';

export function useGetActivities() {
  return useMutation(getActivities);
}
