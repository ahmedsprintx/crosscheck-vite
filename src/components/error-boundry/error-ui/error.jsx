import React from 'react';

import errorBoundaryIcon from 'assets/error-boundary-icon.svg';

import style from './style.module.scss';
import CrossCheckIcon from 'components/icon-component/cross-check-icon';
import { envObject } from 'constants/environmental';

const ErrorUI = () => {
  const { BASE_URL } = envObject;
  return (
    <div className={style.mainWrapper}>
      <div className={style.logo}>
        {' '}
        <CrossCheckIcon />
      </div>
      <div className={style.container}>
        <img src={errorBoundaryIcon}></img>

        <div className={style.textWrapper}>
          <div className={style.title}>Oops. Something Went Wrong!</div>
          <div className={style.description}>
            The page you’re looking for does not seem to exist
          </div>
        </div>
        <a className={style.btn} href={BASE_URL}>
          <span>Back to Home</span>
        </a>
      </div>
    </div>
  );
};

export default ErrorUI;
