import React from 'react';

import style from './icons.module.scss';

const EvidenceLink = ({ backClass }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g clipPath="url(#clip0_12423_18187)">
          <path
            d="M2.6665 5.33329V3.99996C2.6665 3.64634 2.80698 3.3072 3.05703 3.05715C3.30708 2.8071 3.64622 2.66663 3.99984 2.66663H5.33317"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.6665 10.6666V12C2.6665 12.3536 2.80698 12.6927 3.05703 12.9428C3.30708 13.1928 3.64622 13.3333 3.99984 13.3333H5.33317"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6665 2.66663H11.9998C12.3535 2.66663 12.6926 2.8071 12.9426 3.05715C13.1927 3.3072 13.3332 3.64634 13.3332 3.99996V5.33329"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6665 13.3333H11.9998C12.3535 13.3333 12.6926 13.1928 12.9426 12.9428C13.1927 12.6927 13.3332 12.3536 13.3332 12V10.6666"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.6665 8C6.8885 4.88867 9.11117 4.88867 11.3332 8"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.6665 8C6.8885 11.1113 9.11117 11.1113 11.3332 8"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.99983 8H7.99316"
            stroke="#8B909A"
            className={`${style.fill2} ${backClass}`}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_12423_18187">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default EvidenceLink;
