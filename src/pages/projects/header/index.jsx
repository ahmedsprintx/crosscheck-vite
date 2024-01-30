import React, { useState } from 'react';
import threeDots from 'assets/threeDots.svg';
import style from './header.module.scss';
import { useNavigate } from 'react-router-dom';
import StarIcon from 'components/icon-component/star';
import MoreInvertIcon from 'components/icon-component/more-invert';

const HeaderSection = ({ favorites, favoriteToggle }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null); // NOTE: Use null as the initial value

  return (
    <div className={style.main}>
      <div className={style.flex}>
        <StarIcon /> <p>Favorites</p>
      </div>
      <div className={style.innerFlex}>
        <div className={style.moreInner}>
          {favorites?.map((ele, index) => {
            return (
              <div
                key={index}
                className={style.project}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigate(`/projects/${ele?._id}`);
                }}
              >
                <span>
                  {ele.name
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join('')}
                </span>
                <p>{ele.name}</p>
                <div
                  onClick={(e) => {
                    setOpen(index);
                    e.stopPropagation();
                  }}
                  src={threeDots}
                  alt=""
                >
                  <MoreInvertIcon />
                </div>

                <div
                  className={style.tooltip}
                  style={{
                    display: open === index ? 'block' : 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      favoriteToggle(e, ele._id);
                      setOpen(null);
                      e.stopPropagation();
                    }}
                  >
                    <StarIcon /> Unfavorite
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {open !== null && (
        <div
          className={style.backdropDiv}
          onClick={() => {
            setOpen(null);
          }}
        ></div>
      )}
    </div>
  );
};

export default HeaderSection;
