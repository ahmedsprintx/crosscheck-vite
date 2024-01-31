import React, { useEffect, useState } from 'react';
import style from './upcoming.module.scss';
import MultiColorProgressBar from 'components/progress-bar';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import UserInfoPopup from 'components/user-info-popup';
import MailIcon from 'components/icon-component/mail-icon';
import CopyIcon from 'components/icon-component/copy-icon';
import TickIcon from 'components/icon-component/tick';
import ActivityIcon from 'components/icon-component/activity-icon';
import { useToaster } from 'hooks/use-toaster';
import avatar from 'assets/avatar.svg';

const Upcoming = ({
  id,
  testedCount = 0,
  testCases,
  notTestedCount = 0,
  title,
  subTitle,
  date,
  overDue,
  daysPassed,
  data,
  img,
  name,
}) => {
  const navigate = useNavigate();
  const { toastSuccess } = useToaster();
  const [isHoveringName, setIsHoveringName] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  let hoverTimeout;
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);

    hoverTimeout = setTimeout(() => {
      setIsHoveringName(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsHoveringName(false);
  };

  const copyToClipboard = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  };

  const handleCopyEmail = () => {
    const email = data?.user?.email;
    if (email) {
      copyToClipboard(email);
      toastSuccess('Email copied to clipboard');
      setIsCopied(true);
    }
  };
  return (
    <div className={style.wrapper} style={{ cursor: 'pointer' }} onClick={() => navigate(`/test-run/${id}`)}>
      <div
        style={{
          background: '#E25E3E',
          height: '100%',
          width: '3%',
          borderRadius: ' 3px 0px 0px 3px',
        }}
      />
      <div className={style.inner}>
        <p className={style.title}>{title}</p>
        <p className={style.subTitle}>{subTitle}</p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '10px',
          }}
        >
          <MultiColorProgressBar
            readings={
              !testedCount && !notTestedCount
                ? [
                    {
                      name: 'No Test Case',
                      value: 100,
                      color: '#D6D6D6',
                      tooltip: 'No Test Case',
                    },
                  ]
                : [
                    testedCount && {
                      name: 'testedCount',
                      value: (testedCount / testCases?.length) * 100,
                      color: '#34C369',
                      tooltip: 'Tested',
                    },
                    notTestedCount && {
                      name: 'notTestedCount',
                      value: (notTestedCount / testCases?.length) * 100,
                      color: '#D6D6D6',
                      tooltip: 'Not Tested',
                    },
                  ]
            }
            className={style.progressBar}
          />
          {<p className={style.dateScss}>{`${testedCount || 0}/${testCases?.length || 0}`}</p>}
        </div>
        <div className={style.imgSection}>
          <span>
            {date && `Due Date: ${date}`} <span className={style.daysPassed}>{daysPassed} Days</span>
          </span>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'flex', position: 'relative', alignItems: 'center', gap: '5px' }}
          >
            {img ? (
              <img alt="" src={img} style={{ width: '24px', height: '24px', borderRadius: '80%' }} />
            ) : (
              <div
                style={{
                  borderRadius: '80%',
                  background: '#11103d',
                  width: '24px',
                  height: '24px',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {_.first(name)}
              </div>
            )}
            <div style={{ position: 'absolute', zIndex: '1000', top: '25', right: '0' }}>
              {isHoveringName && (
                <div className={style.main}>
                  <div className={style.profileDiv}>
                    <img alt="" src={img || avatar} height={60} width={60} />
                    <span className={style.statusOnline}>Online</span>
                  </div>
                  <div>
                    <span className={style.title}>{name}</span>
                  </div>
                  <div className={style.email} style={{ position: 'relative' }}>
                    <MailIcon />
                    <span>{data?.assignee?.email}</span>
                    <div className={style.copyDiv} onClick={handleCopyEmail}>
                      {!isCopied ? <CopyIcon /> : <TickIcon />}
                    </div>
                    <p className={style.copyText}>{isCopied && 'copied'}</p>
                  </div>
                  <div className={style.email}>
                    <ActivityIcon />
                    <span>{data?.user?.lastActive}</span>
                  </div>
                </div>
              )}
            </div>
            <span>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
