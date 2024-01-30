import React from 'react';

import style from './icons.module.scss';

const ArrowRight = ({ type }) => {
  return (
    <>
      <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          id="Vector"
          d="M14.1589 6.80009H1.15031C0.964677 6.80009 0.786652 6.87383 0.655393 7.00509C0.524134 7.13635 0.450394 7.31437 0.450394 7.5C0.450394 7.68563 0.524134 7.86365 0.655393 7.99491C0.786652 8.12617 0.964677 8.19991 1.15031 8.19991H14.1589L9.05371 13.3037C8.92228 13.4351 8.84845 13.6133 8.84845 13.7992C8.84845 13.9851 8.92228 14.1633 9.05371 14.2947C9.18513 14.4262 9.36338 14.5 9.54924 14.5C9.73511 14.5 9.91336 14.4262 10.0448 14.2947L16.344 7.99554C16.4092 7.93052 16.4609 7.85329 16.4962 7.76825C16.5314 7.68322 16.5496 7.59206 16.5496 7.5C16.5496 7.40794 16.5314 7.31678 16.4962 7.23175C16.4609 7.14672 16.4092 7.06948 16.344 7.00446L10.0448 0.705258C9.91336 0.573833 9.73511 0.5 9.54924 0.5C9.36338 0.5 9.18513 0.573833 9.05371 0.705258C8.92228 0.836683 8.84845 1.01493 8.84845 1.2008C8.84845 1.38666 8.92228 1.56491 9.05371 1.69633L14.1589 6.80009Z"
          className={`${style.fill2}  ${type ? style.IconC : style.IconA} `}
        />
      </svg>
    </>
  );
};

export default ArrowRight;
