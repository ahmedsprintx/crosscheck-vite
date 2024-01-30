import React, { useState } from 'react';
import style from './capture-card.module.scss';
import del from 'assets/Delete.svg';

import captureSample from 'assets/capture-sample.png';
import CaptureMore from 'components/icon-component/capture-more';
import PlayIcon from 'components/icon-component/play';
import MoreMenu from 'components/more-menu';

const CaptureCard = ({ avatar, name, mainImage, duration, index }) => {
  const [open, setOpen] = useState(false);

  const items = [
    {
      title: 'Delete',
      icon: del,
      click: () => {
        // NOTE: setOpenDelModal(true);
      },
    },
  ];

  return (
    <>
      <div className={style.main}>
        <div className={style.image}>
          <img src={mainImage || captureSample} className={style.mainImage} />
          <div
            className={style.moreIcon}
            onClick={(e) => {
              setOpen(!open);
              e.stopPropagation();
            }}
          >
            <CaptureMore />
            {open && <MoreMenu menu={items} />}
          </div>

          <div className={style.duration}>
            <PlayIcon />
            {duration || '00:00'}
          </div>
        </div>
        <div className={style.lowerSection}>
          <div className={style.userInfo}>
            {avatar ? (
              <img src={avatar} alt="" className={style.logo2} />
            ) : (
              <span className={style.initial}>{name?.charAt(0)?.toUpperCase()}</span>
            )}
            <p className={style.text}>{name}</p>
          </div>
          <div className={style.date}>
            <p className={style.text}>12 Oct, 2023</p>
          </div>
        </div>
      </div>
      {open && (
        <div
          className={style.backdrop}
          onClick={(e) => {
            setOpen(false);
            e.stopPropagation();
          }}
        ></div>
      )}
    </>
  );
};

export default CaptureCard;
