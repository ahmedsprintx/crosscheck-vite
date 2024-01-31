import React from 'react';
import style from './mobile-header.module.scss';

import appLogo from 'assets/cross-check-icon.png';
import _ from 'lodash';
import ArrowRightSingle from 'components/icon-component/arrow-right-single';
import { useAppContext } from 'context/app.context';
const MobileHeader = ({ setIsOpen, matchingWorkspace }) => {
  const { userDetails } = useAppContext();

  const signUpMode = userDetails?.signUpType;

  return (
    <div className={style.mobileHeader}>
      <img src={appLogo} alt="" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => setIsOpen(true)}>
        <div className={style.imgDiv}>
          <>
            {userDetails?.profilePicture ? (
              <img src={userDetails?.profilePicture} alt="" />
            ) : (
              <span>{_.first(userDetails?.name)}</span>
            )}
          </>
          {signUpMode !== 'Extension' && (
            <>
              {matchingWorkspace?.avatar ? (
                <img src={matchingWorkspace?.avatar} alt="" />
              ) : (
                <span>{_.first(matchingWorkspace?.name)}</span>
              )}
            </>
          )}
        </div>
        <div style={{ rotate: '90deg' }}>
          <ArrowRightSingle />
        </div>
      </div>
    </div>
  );
};
export default MobileHeader;
