import React, { useEffect, useState } from 'react';
import style from './dev-dashboard.module.scss';
import ValueBox from 'components/value-box';
import ExpandableCard from './expandable-card';
import {
  useGetAssignedBugsWidget,
  useGetDevAnalytics,
  useGetHighSeverityBugsWidget,
  useGetOpenedBugsWidget,
  useGetReproducibleBugsWidget,
} from 'hooks/api-hooks/dashboard/dashboard.hook';
import Loader from 'components/loader';

const DevDashboard = () => {
  const [devAnalytics, setDevAnalytics] = useState({});
  const [highSeverityBugs, setHighSeverityBugs] = useState({});
  const [reproducibleBugs, setReproducibleBugs] = useState({});
  const [assignedBugs, setAssignedBugs] = useState({});
  const [openedBugs, setOpenedBugs] = useState({});

  // NOTE: get dev analytics
  const { mutateAsync: _getDevAnalytics, isLoading: _isLoading } = useGetDevAnalytics();
  const fetchDevAnalytics = async () => {
    try {
      const response = await _getDevAnalytics();
      setDevAnalytics(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchDevAnalytics();
  }, []);

  // NOTE: Get High Severity Bugs Widget DAta
  const { isLoading: isRefetching, refetch } = useGetHighSeverityBugsWidget({
    page: 0,
    perPage: 25,
    onSuccess: (data) => {
      setHighSeverityBugs(data?.highSeverityBugs);
    },
  });

  // NOTE: Get High Severity Reproducible Widget Data
  const { isLoading: isRefetchingReproducible } = useGetReproducibleBugsWidget({
    page: 0,
    perPage: 25,
    onSuccess: (data) => {
      setReproducibleBugs(data?.reproducibleBugs);
    },
  });

  // NOTE: Get High Severity Reproducible Widget Data
  const { isLoading: isRefetchingAssignedBugs } = useGetAssignedBugsWidget({
    page: 0,
    perPage: 25,
    onSuccess: (data) => {
      setAssignedBugs(data?.assignedBugs);
    },
  });

  // NOTE: Get Opened Reproducible Widget Data
  const { isLoading: isRefetchingOpenedBugs } = useGetOpenedBugsWidget({
    page: 0,
    perPage: 25,
    onSuccess: (data) => {
      setOpenedBugs(data?.openBugs);
    },
  });

  return (
    <>
      {_isLoading || isRefetching || isRefetchingReproducible || isRefetchingAssignedBugs ? (
        <Loader />
      ) : (
        <div className={style.mainWrapper}>
          <div className={style.upperDiv}>
            <ValueBox className={style.boxWidth} heading={'My Bugs'} value={devAnalytics?.myBugs} />
            <ValueBox className={style.boxWidth} heading={'Closed'} value={devAnalytics?.closedBugs} />
            <ValueBox className={style.boxWidth} heading={'Opened'} value={devAnalytics?.openBugs} />
            <ValueBox className={style.boxWidth} heading={'Reproducible'} value={devAnalytics?.reproducibleBugs} />
            <ValueBox className={style.boxWidth} heading={'Need to Discuss'} value={devAnalytics?.needToDiscusBugs} />
            <ValueBox className={style.boxWidth} heading={'Blocked'} value={devAnalytics?.blocked} />
          </div>
          <div className={style.middleDiv}>
            <div className={style.left}>
              <div className={style.activeProjects}>
                <h2>Active Projects</h2>
                {devAnalytics?.activeProjects?.map((item) => {
                  return (
                    <div className={style.projectsBar}>
                      <span>{item?.name}</span>
                      <span style={{ fontSize: '15px' }}>{item?.notClosedBugs}</span>
                    </div>
                  );
                })}
              </div>
              <div className={style.valueBoxDiv}>
                <ValueBox
                  heading={'Bugs Reproducible Rate'}
                  value={`${devAnalytics?.reproducibleBugsRate}%`}
                  className={style.valueBoxClass}
                />
                <ValueBox
                  heading={'Bug Closure Rate'}
                  value={`${devAnalytics?.avgDaysToClose} Days`}
                  className={style.valueBoxClass}
                />
              </div>
            </div>
            <div className={style.right}>
              <ExpandableCard title={'My Recent Opened Bugs'} data={openedBugs} reportedBy />
            </div>
          </div>
          <div className={style.lowerDiv}>
            <div className={style.innerCards}>
              <ExpandableCard
                maxHeight={'365px'}
                data={highSeverityBugs}
                reportedBy
                title={'Critical / High Severity Bugs'}
              />
            </div>
            <div className={style.innerCards}>
              <ExpandableCard maxHeight={'365px'} data={reproducibleBugs} lastTestedBy title={'Reproducible Bugs'} />
            </div>
            <div className={style.innerCards}>
              <ExpandableCard maxHeight={'365px'} title={'Current Assigned Bugs'} reportedBy data={assignedBugs} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevDashboard;
