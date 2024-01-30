import { getUsers } from 'api/v1/settings/user-management';
import _ from 'lodash';
import { useQuery } from 'react-query';

export function useActivityOptions() {
  return useQuery({
    queryKey: ['activityOptions'],
    queryFn: async () => {
      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const activityType = [
        { label: 'Login', value: 'Login', checkbox: true },
        { label: 'User Management', value: 'User Management', checkbox: true },
        {
          label: 'Account Settings',
          value: 'Account Settings',
          checkbox: true,
        },
        { label: 'Test Cases', value: 'Test Cases', checkbox: true },
        { label: 'Bugs Reporting', value: 'Bugs Reporting', checkbox: true },
        { label: 'Test Runs', value: 'Test Runs', checkbox: true },
        { label: 'Projects', value: 'Projects', checkbox: true },
        { label: 'Trash', value: 'Trash', checkbox: true },
      ];

      return {
        activityBy: users
          .filter((x) => x.status)
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        activityType,
      };
    },
    refetchOnWindowFocus: false,
  });
}
