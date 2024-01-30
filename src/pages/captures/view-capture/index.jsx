import React from 'react';
import style from './single-capture.module.scss';
import GeneralInfo from './general-info';
import DevtoolsInfo from './devtools-info';
import AppLogo from 'components/icon-component/app-icon';
import Button from 'components/button';
import { useAppContext } from 'context/app.context';
import { useNavigate } from 'react-router-dom';

const CaptureSingle = () => {
  const { userDetails } = useAppContext();
  const navigate = useNavigate();
  return (
    <>
      <div className={style.captureNav}>
        <AppLogo />
        {!userDetails?.id && (
          <Button
            text={'Sign up for free'}
            btnClass={style.strokeBtn}
            handleClick={() => navigate('/sign-up')}
          />
        )}
      </div>
      <div className={style.mainWrapper}>
        <div className={style.leftDiv}></div>
        <div className={style.centerBorder} />
        <div className={style.rightDiv}>
          <GeneralInfo />
          <DevtoolsInfo />
        </div>
      </div>
    </>
  );
};

export default CaptureSingle;
