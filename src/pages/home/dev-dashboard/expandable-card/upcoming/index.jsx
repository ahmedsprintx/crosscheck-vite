import React from 'react';
import style from './upcoming.module.scss';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useToaster } from 'hooks/use-toaster';
import { useState } from 'react';
import Tags from 'components/tags';
import { formattedDate } from 'utils/date-handler';

const Upcoming = ({
  reportedBy,
  lastTestedBy,
  title,
  subTitle,
  date,
  tagText,
  data,
  img,
  name,
}) => {
  const navigate = useNavigate();
  const { toastSuccess } = useToaster();
  const [setIsHoveringName] = useState(false);
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
    <div className={style.wrapper} style={{ cursor: 'pointer' }}>
      <div
        style={{
          background: '#11103D',
          height: '100%',
          width: '3%',
          borderRadius: ' 3px 0px 0px 3px',
        }}
      />
      <div className={style.inner}>
        <p className={style.title} onClick={() => navigate(`/qa-testing?bugId=${title}`)}>
          {title}{' '}
          <Tags
            text={tagText ? tagText : '-'}
            colorScheme={{
              Low: '#4F4F6E',
              High: '#F96E6E',
              Medium: '#B79C11',
              Critical: '#F80101',
            }}
          />
        </p>
        <p className={style.subTitle}>{subTitle}</p>
        <div className={style.imgSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>{reportedBy ? 'Reported by:' : lastTestedBy ? 'Last Tested By:' : ''} </span>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ display: 'flex', position: 'relative', alignItems: 'center', gap: '5px' }}
            >
              {img ? (
                <img src={img} style={{ width: '24px', height: '24px', borderRadius: '80%' }} />
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
                  {_.first(reportedBy ? reportedBy : lastTestedBy ? lastTestedBy : '-')}
                </div>
              )}

              <span>{reportedBy ? reportedBy : lastTestedBy ? lastTestedBy : '-'}</span>
            </div>
          </div>
          <div>
            <span>{`${formattedDate(date, 'dd MMM, yyyy')} at ${formattedDate(
              date,
              'h:mm a',
            )}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
