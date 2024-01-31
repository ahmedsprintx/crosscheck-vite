import MainWrapper from 'components/layout/main-wrapper';
import React from 'react';

import { formattedDate } from 'utils/date-handler';

import style from './captures.module.scss';
import CaptureCard from 'components/capture-card';
import { useNavigate } from 'react-router-dom';
import Button from 'components/button';
import RowIcon from 'components/icon-component/row-icon';
import gridIcon from 'assets/grid.svg';

const Captures = () => {
  const navigate = useNavigate();

  return (
    <div>
      <MainWrapper searchField title="My Captures" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
        <div className={style.mainClass} style={{ height: 'fit-content' }}>
          <div className={style.flexDiv}>
            <div>
              <img alt="" src={gridIcon} className={style.imgClass} />
            </div>
            <div>
              <RowIcon />
            </div>
            <h2>Checks (28)</h2>
          </div>
          <div className={style.exportDiv}>
            <Button text={`Filters ()`} btnClass={style.filterBtn} handleClick={() => {}} />
          </div>
        </div>
        <div className={style.contentGrid}>
          {capturesSample?.map((ele, index) => (
            <div onClick={() => navigate(`/captures/${index}`)} key={index}>
              <CaptureCard name={ele?.name} duration={ele?.duration} />
            </div>
          ))}
        </div>
      </MainWrapper>
    </div>
  );
};

export default Captures;

const capturesSample = [
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
  { name: 'Fazian Ali', duration: '12:00' },
];
