import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { formatDistanceToNow } from 'date-fns';

// NOTE: component
import Loader from 'components/loader';

// NOTE: hooks
import { useGetActivities } from 'hooks/api-hooks/settings/activities.hook';

// NOTE: assets
import noData from 'assets/no-found.svg';
// NOTE: styles
import style from './activity.module.scss';
const Activities = ({ noHeader, bugId }) => {
  const containerRef = useRef(null);

  const [activities, setActivities] = useState([]);

  const {
    mutateAsync: _activitiesDataHandler,

    isLoading: isRefetching,
  } = useGetActivities();

  const fetchData = async () => {
    const res = await _activitiesDataHandler({
      activityBy: [],
      activityType: [],
      ...(bugId && { bugId }),
    });

    setActivities(res?.activities);
  };
  useEffect(() => {
    fetchData();
  }, [bugId]);

  return (
    <div
      style={{
        height: bugId ? '40vh' : '100vh',
        overflow: 'hidden',
      }}
    >
      <div ref={containerRef} className={style.activityWrapper} style={{ height: '80vh', overflow: 'auto' }}>
        <div className={style.activitiesInner}>
          {activities?.length ? (
            activities?.map((e, i) => {
              return (
                <div className={style.activities}>
                  <div
                    className={style.greyLine}
                    style={{
                      display: i === activities?.length - 1 ? 'none' : '',
                    }}
                  />

                  {e?.activityBy?.profilePicture ? (
                    <img
                      src={e?.activityBy?.profilePicture}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '80%',
                      }}
                    />
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
                      {_.first(e?.activityBy?.name)}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className={style.line}>{` ${e?.activityBy?.name} ${e?.activityText}`}</span>
                    {e?.descriptionText?.map((x) => {
                      return (
                        <span className={style.line} style={{ margin: '2px 0' }} key={x}>
                          {x}
                        </span>
                      );
                    })}
                    <span>
                      {` ${formatDistanceToNow(new Date(e.activityAt), {
                        includeSeconds: true,
                      })}`}{' '}
                      ago
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 265px)',
              }}
            >
              <img src={noData} alt="" />
            </div>
          )}
        </div>
        {isRefetching && <Loader tableMode />}
      </div>
    </div>
  );
};

export default Activities;

const data = [
  {
    user: 'faizan',
    activity: 'logged in',
    time: '1 hour ago',
  },
  {
    user: 'faizan',
    time: '1 hour ago',
    otherUser: 'Ali',
    newRole: 'Developer',
    added: true,
  },
  {
    user: 'faizan',
    time: '1 hour ago',
    otherUser: 'Ali',
    deleted: true,
  },
  {
    userInfo: true,
    user: 'faizan',
    otherUser: 'Ali',
    oldName: 'Imran',
    newName: 'Hamza',
    oldEmail: ' john.mac@example.com',
    newEmail: ' alex.mac@example.com',
    time: '1 hour ago',
    role: 'Intern',
    newRole: 'Developer',
  },
  {
    user: 'faizan',
    oldTestType: 'Functionality Testing',
    newTestType: 'Security Testing',
    oldTestCase: 'ERP-T-125',
    newTestCase: 'ERP-T-222',
    oldTicketId: 'ERP-333',
    newTicketId: 'ERP-300',
    oldObjective: 'Verify that the user can change the columns displayed',
    newObjective: 'Verify that the user can change the columns displayed in the Test Runs table.',
    time: '1 hour ago',
    oldTestStep: 'Open the Test Runs module. “Click on the "Change Columns" button.',
    newTestStep: 'Open the Test Runs module. Click on the "Change Columns',
    info: true,
  },
];
