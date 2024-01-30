import React from 'react';

import style from './general.module.scss';

const GeneralInfo = () => {
  return (
    <div className={style.generalDiv}>
      <h6>General Info</h6>
      <div className={style.generalInfo}>
        <div className={style.infoFlex}>
          <p className={style.innerP}>URL</p>
          https://www.app-dev.crosscheck.cloud?active=3
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Timestamp</p>
          date
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Device</p>
          device info
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Browser</p>
          browsere info
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>View-port Size</p>
          dimension
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Country</p>
          location
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
