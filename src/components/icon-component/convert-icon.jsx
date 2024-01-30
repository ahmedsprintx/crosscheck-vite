import React from 'react';

import style from './icons.module.scss';

const ConvertIcon = ({ backClass }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path
          d="M14.75 5.66257L12.5278 3.26257M12.5278 3.26257L9.86111 5.66257M12.5278 3.26257V8.06257C12.5278 9.82985 10.9359 11.2626 8.97222 11.2626H3.75M1.25 6.75752L3.7709 8.7373M3.7709 8.7373L6.16866 6.75752M3.7709 8.7373V3.9373C3.7709 2.16999 5.3725 0.737305 7.34811 0.737305H12.25"
          stroke="#8B909A"
          className={`${style.fill2} ${backClass}`}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  );
};

export default ConvertIcon;
