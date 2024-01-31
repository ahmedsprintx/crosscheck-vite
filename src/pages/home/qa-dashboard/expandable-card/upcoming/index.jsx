import React, { useState } from 'react';
import style from './upcoming.module.scss';
import MultiColorProgressBar from 'components/progress-bar';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useToaster } from 'hooks/use-toaster';

const Upcoming = ({ id, testedCount, testCases, notTestedCount, title, subTitle, date, data }) => {
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
    <div
      className={style.wrapper}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/test-run/${id}`)}
    >
      <div className={style.inner}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <p className={style.title}>{title}</p>
          <p className={style.dateScss}>{date && `Due Date: ${date}`}</p>
        </div>
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
            readings={[
              testedCount && {
                name: 'testedCount',
                value: (testedCount / testCases?.length) * 100,
                color: '#34C369',
              },
              notTestedCount && {
                name: 'notTestedCount',
                value: (notTestedCount / testCases?.length) * 100,
                color: '#D6D6D6',
              },
            ]}
            className={style.progressBar}
          />
          <p className={style.dateScss}>{`(${testedCount}/${testCases?.length})`}</p>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
