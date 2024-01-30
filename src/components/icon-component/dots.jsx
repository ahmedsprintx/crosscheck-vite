import React from 'react';
import style from './icons.module.scss';
const ExpandIcon = () => {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <svg width="3" height="12" viewBox="0 0 3 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z"
          fill="#8B909A"
          className={style.fill4}
        />
        <path
          d="M1.5 7.5C2.32843 7.5 3 6.82843 3 6C3 5.17157 2.32843 4.5 1.5 4.5C0.671573 4.5 0 5.17157 0 6C0 6.82843 0.671573 7.5 1.5 7.5Z"
          fill="#8B909A"
          className={style.fill4}
        />
        <path
          d="M1.5 12C2.32843 12 3 11.3284 3 10.5C3 9.67157 2.32843 9 1.5 9C0.671573 9 0 9.67157 0 10.5C0 11.3284 0.671573 12 1.5 12Z"
          fill="#8B909A"
          className={style.fill4}
        />
      </svg>
    </svg>
  );
};

export default ExpandIcon;
