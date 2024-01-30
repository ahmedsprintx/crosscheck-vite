import React from 'react';
import style from './console.module.scss';
import ClickOn from 'components/icon-component/click-on';
import KeyboardIcon from 'components/icon-component/keyboard';
import DotIcon from 'components/icon-component/dot-icon';

const ConsoleText = ({ data }) => {
  return (
    <>
      <div className={style.mainWrapper}>
        <div className={style.time}>date</div>
        <div className={style.icon}>
          {data?.event === 'click' ? (
            <ClickOn />
          ) : data?.event === 'dblclick' ? (
            <ClickOn />
          ) : data?.event === 'keypress' ? (
            <KeyboardIcon />
          ) : (
            <DotIcon />
          )}
        </div>
        <div className={style.desc}>
          <span>
            {data?.event === 'click' ? (
              'Clicked'
            ) : data?.event === 'dblclick' ? (
              'Double Clicked'
            ) : data?.event === 'keypress' ? (
              'Key Pressed'
            ) : (
              <DotIcon />
            )}
          </span>
          {data?.event === 'keypress' && <span>{data?.keyPressed} </span>}
          <span>{`<${data?.tagName?.toLowerCase()} class='${data.classNames}' id='${
            data.id
          }'> `}</span>
        </div>
      </div>
    </>
  );
};

export default ConsoleText;
