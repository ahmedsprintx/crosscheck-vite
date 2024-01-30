import _ from 'lodash';

export const emailValidate = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? true : 'Invalid Email';
};

export const validateDescription = ({ description }) => {
  if (
    description?.blocks?.some((x) => x.text !== '') ||
    !_.isEmpty(description?.entityMap)
  ) {
    return true;
  }

  return 'Required';
};
