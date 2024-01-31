import React, { useMemo, useState } from 'react';
import noFound from 'assets/no-found.svg';
import expandIcon from 'assets/expand.svg';
import ExpandModal from './expand-modal';
import { formattedDate } from 'utils/date-handler';
import { isPast, parseISO } from 'date-fns';

import style from './expandable.module.scss';
import Upcoming from './upcoming';
import Tabs from 'components/tabs';

const ExpandableCard = ({ title, expanded, maxHeight, data }) => {
  const [expandModal, setExpandModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const dueTodayCount = data?.testruns?.filter((item) => {
    const dueDate = parseISO(item?.dueDate);
    const currentDate = new Date();
    return dueDate.toDateString() === currentDate.toDateString() && item?.status === 'Open';
  })?.length;

  // NOTE: Define the isToday function
  const isToday = (date) => {
    const today = new Date();
    return (
      date?.getDate() === today?.getDate() &&
      date?.getMonth() === today?.getMonth() &&
      date?.getFullYear() === today?.getFullYear()
    );
  };

  const pages = useMemo(() => {
    return [
      {
        id: 0,
        tabTitle: `Due Today (${dueTodayCount || 0})`,
        content: activeTab === 0 && (
          <div className={style.upcomingInner}>
            {data && data?.testruns?.length > 0 ? (
              <>
                {data?.testruns
                  .filter((item) => {
                    const dueDate = parseISO(item?.dueDate);
                    const currentDate = new Date();
                    return dueDate.toDateString() === currentDate.toDateString() && item?.status === 'Open';
                  })
                  .map((item, i) => (
                    <Upcoming
                      key={i}
                      id={item?._id}
                      testedCount={item?.testedCount}
                      testCases={item?.testCases}
                      notTestedCount={item?.notTestedCount}
                      title={item?.runId}
                      subTitle={item?.name}
                      date={formattedDate(new Date(item?.dueDate), 'dd MMM, yyyy')}
                      overDue={isPast(parseISO(item.dueDate))}
                      img={item?.assignee?.profilePicture}
                      name={item?.assignee?.name}
                      data={item}
                    />
                  ))}
              </>
            ) : (
              <div className={style.noFoundDiv}>
                <img src={noFound} alt="" />
              </div>
            )}
          </div>
        ),
      },
      {
        id: 1,
        tabTitle: `Overdue (${
          data?.testruns?.filter(
            (item) =>
              isPast(parseISO(item?.dueDate)) &&
              !isToday(parseISO(item?.dueDate)) && // NOTE: Exclude items that are due today
              item?.status === 'Open',
          )?.length || 0
        })`,
        content: activeTab === 1 && (
          <div className={style.upcomingInner}>
            {data && data?.testruns?.length > 0 ? (
              <>
                {data?.testruns
                  ?.filter(
                    (item) =>
                      isPast(parseISO(item?.dueDate)) &&
                      !isToday(parseISO(item?.dueDate)) && // NOTE: Exclude items that are due today
                      item?.status === 'Open',
                  )
                  ?.map((item, i) => (
                    <Upcoming
                      key={item?._id} // NOTE: Make sure to add a unique key for each mapped element
                      id={item?._id}
                      testedCount={item?.testedCount}
                      testCases={item?.testCases}
                      notTestedCount={item?.notTestedCount}
                      title={item?.runId}
                      subTitle={item?.name}
                      date={formattedDate(new Date(item?.dueDate), 'dd MMM, yyyy')}
                      overDue={isPast(parseISO(item.dueDate))}
                      img={item?.assignee?.profilePicture}
                      name={item?.assignee?.name}
                      data={item}
                    />
                  ))}
              </>
            ) : (
              <div className={style.noFoundDiv}>
                <img src={noFound} alt="" />
              </div>
            )}
          </div>
        ),
      },

      {
        id: 2,
        tabTitle: `Upcoming (${
          data?.testruns?.filter((item) => {
            const dueDate = parseISO(item?.dueDate);
            const currentDate = new Date();
            return dueDate > currentDate && item?.status === 'Open';
          })?.length || 0
        })`,
        content: activeTab === 2 && (
          <div className={style.upcomingInner}>
            {data && data?.testruns?.length > 0 ? (
              <>
                {data?.testruns
                  .filter((item) => {
                    const dueDate = parseISO(item?.dueDate);
                    const currentDate = new Date();
                    return dueDate > currentDate && item?.status === 'Open';
                  })
                  .map((item, i) => (
                    <Upcoming
                      key={i}
                      id={item?._id}
                      testedCount={item?.testedCount}
                      testCases={item?.testCases}
                      notTestedCount={item?.notTestedCount}
                      title={item?.runId}
                      subTitle={item?.name}
                      date={formattedDate(new Date(item?.dueDate), 'dd MMM, yyyy')}
                      overDue={isPast(parseISO(item.dueDate))}
                      img={item?.assignee?.profilePicture}
                      name={item?.assignee?.name}
                      data={item}
                    />
                  ))}
              </>
            ) : (
              <div className={style.noFoundDiv}>
                <img src={noFound} alt="" />
              </div>
            )}
          </div>
        ),
      },
    ];
  }, [activeTab, data]);

  return (
    <div className={style.upcomingDiv} style={{ maxHeight: maxHeight && maxHeight }}>
      <div className={style.upcomingHeader}>
        <span>{title}</span>
        {!expanded && <img alt="" src={expandIcon} onClick={() => setExpandModal(true)} />}
      </div>
      <div className={style.tabDiv}>
        <Tabs pages={pages?.filter((x) => x.tabTitle)} activeTab={activeTab} setActiveTab={setActiveTab} />
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
