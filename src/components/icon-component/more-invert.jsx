import React from 'react';

import style from './icons.module.scss';

const MoreInvertIcon = ({ onClick }) => {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-cy="projectcard-threedots-icon"
        onClick={onClick}
      >
        <g id="Generic">
          <path
            id="Vector"
            d="M13.5 17C13.5 17.8 12.8 18.5 12 18.5C11.2 18.5 10.5 17.8 10.5 17C10.5 16.2 11.2 15.5 12 15.5C12.8 15.5 13.5 16.2 13.5 17ZM13.5 12C13.5 12.8 12.8 13.5 12 13.5C11.2 13.5 10.5 12.8 10.5 12C10.5 11.2 11.2 10.5 12 10.5C12.8 10.5 13.5 11.2 13.5 12ZM13.5 7C13.5 7.8 12.8 8.5 12 8.5C11.2 8.5 10.5 7.8 10.5 7C10.5 6.2 11.2 5.5 12 5.5C12.8 5.5 13.5 6.2 13.5 7Z"
            fill="#8B909A"
            className={style.grey}
          />
        </g>
      </svg>
    </>
  );
};

export default MoreInvertIcon;
