import React from 'react';

import style from './icons.module.scss';

const EditIcon = ({ backClass }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-cy="projectcard-edit-icon"
        width="14"
        height="15"
        viewBox="0 0 14 15"
        fill="none"
      >
        <path
          d="M7.78005 3.08001L11.42 6.71998M7.78005 3.08001L9.86003 1L13.5 4.64001L11.42 6.71998L7.78005 3.08001ZM7.78005 3.08001L0.715389 10.1446C0.577481 10.2825 0.5 10.4696 0.5 10.6646V14H3.83539C4.03043 14 4.21748 13.9226 4.3554 13.7846L11.42 6.71998L7.78005 3.08001Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${style.strokeBlue} ${backClass}`}
        />
      </svg>
    </>
  );
};

export default EditIcon;
