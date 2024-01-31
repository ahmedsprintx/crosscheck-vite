import React from 'react';

import style from './icons.module.scss';

const VideoIcon = () => {
  return (
    <>
      <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.125 25H19.875M0.75 2.84615V17.6154C0.75 18.105 0.9419 18.5746 1.28348 18.9208C1.62507 19.267 2.08836 19.4615 2.57143 19.4615H24.4286C24.9116 19.4615 25.3749 19.267 25.7165 18.9208C26.0581 18.5746 26.25 18.105 26.25 17.6154V2.84615C26.25 2.35652 26.0581 1.88695 25.7165 1.54073C25.3749 1.1945 24.9116 1 24.4286 1H2.57143C2.08836 1 1.62507 1.1945 1.28348 1.54073C0.9419 1.88695 0.75 2.35652 0.75 2.84615Z"
          stroke="black"
          strokeWidth="1.5"
          className={style.fill2}
        />
        <circle cx="13.5" cy="10.75" r="3.75" fill="#E02B2B" />
      </svg>
    </>
  );
};

export default VideoIcon;
