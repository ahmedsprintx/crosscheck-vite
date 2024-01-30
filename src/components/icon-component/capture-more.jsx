import React from 'react';

import style from './icons.module.scss';

const CaptureMore = () => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clip-path="url(#clip0_12391_5741)">
          <path
            d="M12 13.2188C12.6731 13.2188 13.2188 12.6731 13.2188 12C13.2188 11.3269 12.6731 10.7812 12 10.7812C11.3269 10.7812 10.7812 11.3269 10.7812 12C10.7812 12.6731 11.3269 13.2188 12 13.2188Z"
            fill="#1F1F1F"
          />
          <path
            d="M12 17.4375C12.6731 17.4375 13.2188 16.8918 13.2188 16.2188C13.2188 15.5457 12.6731 15 12 15C11.3269 15 10.7812 15.5457 10.7812 16.2188C10.7812 16.8918 11.3269 17.4375 12 17.4375Z"
            fill="#1F1F1F"
          />
          <path
            d="M12 9C12.6731 9 13.2188 8.45435 13.2188 7.78125C13.2188 7.10815 12.6731 6.5625 12 6.5625C11.3269 6.5625 10.7812 7.10815 10.7812 7.78125C10.7812 8.45435 11.3269 9 12 9Z"
            fill="#1F1F1F"
          />
          <g filter="url(#filter0_d_12391_5741)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.25 12C2.25 6.61704 6.61704 2.25 12 2.25C17.383 2.25 21.75 6.61704 21.75 12C21.75 17.383 17.383 21.75 12 21.75C6.61704 21.75 2.25 17.383 2.25 12ZM12 3.75C7.44546 3.75 3.75 7.44546 3.75 12C3.75 16.5545 7.44546 20.25 12 20.25C16.5545 20.25 20.25 16.5545 20.25 12C20.25 7.44546 16.5545 3.75 12 3.75Z"
              fill="#1F1F1F"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_12391_5741"
            x="0.25"
            y="2.25"
            width="23.5"
            height="23.5"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12391_5741" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12391_5741" result="shape" />
          </filter>
          <clipPath id="clip0_12391_5741">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default CaptureMore;
