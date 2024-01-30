import { useGetUsers } from 'hooks/api-hooks/settings/user-management.hook';
import _ from 'lodash';

export const statusOptions = [
  {
    label: 'Open',
    value: 'Open',
  },
  {
    label: 'Closed',
    value: 'Closed',
  },
];

export const useUsersOptions = () => {
  const { data } = useGetUsers({
    sortBy: '',
    sort: '',
    search: '',
  });

  return {
    usersOptions: data?.users?.map((x) => ({
      label: x.name,
      email: x.email,
      ...(x?.profilePicture && { image: x?.profilePicture }),
      ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
      value: x._id,
      checkbox: true,
      role: x?.role,
    })),
  };
};

export function generateRandomString() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)])
    .join('')
    .toLocaleUpperCase();
}
