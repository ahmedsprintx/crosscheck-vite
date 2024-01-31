import React, { useState } from 'react';
import Upcoming from './upcoming';
import noFound from 'assets/no-found.svg';
import expandIcon from 'assets/expand.svg';

import style from './expandable.module.scss';
import ExpandModal from './expand-modal';

const ExpandableCard = ({ title, expanded, maxHeight, reportedBy, lastTestedBy, data }) => {
  const [expandModal, setExpandModal] = useState(false);

  return (
    <div className={style.upcomingDiv} style={{ maxHeight: maxHeight && maxHeight }}>
      <div className={style.upcomingHeader}>
        <span>{title}</span>
        {!expanded && <img alt="" src={expandIcon} onClick={() => setExpandModal(true)} />}
      </div>
      <div className={style.upcomingInner}>
        {data && data?.length > 0 ? (
          <>
            {data?.map((item, i) => {
              return (
                <Upcoming
                  key={i}
                  title={item?.bugId}
                  subTitle={item?.feedback?.text}
                  date={item?.reportedAt}
                  reportedBy={reportedBy && item?.reportedBy?.name}
                  lastTestedBy={lastTestedBy && item?.reportedBy?.name}
                  tagText={item?.severity}
                />
              );
            })}
          </>
        ) : (
          <div className={style.noFoundDiv}>
            <img src={noFound} alt="" />
          </div>
        )}
      </div>
      {expandModal && (
        <ExpandModal
          data={data}
          open={expandModal}
          setOpen={() => setExpandModal(false)}
          className={style.modal}
          title={title}
        />
      )}
    </div>
  );
};

export default ExpandableCard;
const sample = [1, 2];
