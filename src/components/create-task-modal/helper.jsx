import { getUsers } from 'api/v1/settings/user-management';
import { useQuery } from 'react-query';

export function useProjectOptions() {
  return useQuery({
    queryKey: ['testRunOptions'],
    queryFn: async () => {
      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });
      const priorityOptions = [
        { label: 'High', value: 'High', checkbox: true },
        { label: 'Medium', value: 'Medium', checkbox: true },
        { label: 'Low', value: 'Low', checkbox: true },
      ];

      return {
        priorityOptions,
        assignedTo: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
      };
    },
    refetchOnWindowFocus: true,
  });
}
