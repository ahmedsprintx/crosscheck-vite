import React from 'react';
import style from './loader.module.scss';

const Loader = ({ tableMode, className }) => {
  return (
    <div className={`${tableMode ? style.TableLoader : style.container} ${className}`} data-cy="crosscheck-loader" >
      <div className={style.snippet}>
        <div className={style.stage}>
          <div className={style.dotElastic}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
