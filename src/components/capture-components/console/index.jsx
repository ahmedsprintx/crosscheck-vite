import React, { useState } from 'react';

import style from './console.module.scss';
import WarningIcon from 'components/icon-component/warning-icon';
import ErrorIcon from 'components/icon-component/errors-log';
import LogsIcon from 'components/icon-component/logs-icon';

const ConsoleText = ({ type, data }) => {
  const [expand, setExpand] = useState(false);
  return (
    <>
      <div className={style.mainWrapper}>
        <div className={style.time}>{data?.time}</div>
        <div className={style.icon}>
          {type === 'warns' ? <WarningIcon /> : type === 'errors' ? <ErrorIcon /> : type === 'logs' ? <LogsIcon /> : ''}
        </div>

        <div className={style.desc}>
          {data?.text.map((x, i) =>
            x && typeof JSON.parse(x) === 'object' ? (
              <div key={i}>Object view</div>
            ) : (
              <span
                key={i}
                style={{
                  color: type === 'errors' ? '#f80101' : type === 'warns' ? '#B79C11' : type === 'logs' ? 'black' : '',
                }}
              >
                {JSON.parse(x)}
              </span>
            ),
          )}
        </div>
      </div>
    </>
  );
};

export default ConsoleText;
