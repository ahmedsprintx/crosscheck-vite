import React from 'react';
import style from './icons.module.scss';

const ArchiveIcon = ({ backClass }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        data-cy="projectcard-archive-icon"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
      >
        <path
          d="M13.7573 5.28747V14.0557C13.7573 14.6694 13.2598 15.1668 12.6461 15.1668H3.35321C2.73956 15.1668 2.2421 14.6694 2.2421 14.0557V5.46986M13.7573 5.28747L2.2421 5.46986M13.7573 5.28747C14.2593 5.28747 14.6663 4.88045 14.6663 4.37838V2.94461C14.6663 2.33096 14.1689 1.8335 13.5552 1.8335H2.44412C1.83047 1.8335 1.33301 2.33096 1.33301 2.94461V4.56077C1.33301 5.06285 1.74002 5.46986 2.2421 5.46986M6.18149 9.71228H9.81786"
          strokeLinecap="round"
          className={`${style.strokeBlue} ${backClass}`}
        />
      </svg>
    </>
  );
};

export default ArchiveIcon;
