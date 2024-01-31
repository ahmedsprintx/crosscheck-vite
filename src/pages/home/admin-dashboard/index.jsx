import React, { useState, useEffect } from 'react';

import dots from 'assets/threeDots.svg';

import style from './home.module.scss';
import { calculateDaysPassed, formattedDate } from 'utils/date-handler';
import Upcoming from './upcoming';
import Report from './report';
import { useForm } from 'react-hook-form';
import { useAppContext } from 'context/app.context';
import Permissions from 'components/permissions';
import { useGetTestRunsByFilter } from 'hooks/api-hooks/test-runs/test-runs.hook';
import { useToaster } from 'hooks/use-toaster';
import { isPast, parseISO } from 'date-fns';
import _ from 'lodash';
import { useGetUserById } from 'hooks/api-hooks/settings/user-management.hook';
import Loader from 'components/loader';
import ValueBox from 'components/value-box';
import DevReport from './dev-report';
import { useGetOverallAnalytics } from 'hooks/api-hooks/dashboard/dashboard.hook';

const AdminDashboard = () => {
  const { toastError } = useToaster();
  const { userDetails } = useAppContext();
  const { control, watch } = useForm();
  const [testRuns, setTestRuns] = useState({});
  const [allAnalytics, setAllAnalytics] = useState({});
  const [isHoveringName, setIsHoveringName] = useState({});

  // NOTE: Get the query string from the URL
  const queryString = window.location.search;

  // NOTE: Split the query string by ampersand (&)
  const queryParams = queryString.substr(1).split('?');

  // NOTE: Initialize variables to store the values
  let otp = null;
  let ws = null;
  let newEmail = null;
  let newWorkspace = null;

  // NOTE: Iterate over the query parameters and parse them
  queryParams.forEach((param) => {
    const [key, value] = param.split('=');
    if (key === 'otp') {
      otp = value;
    } else if (key === 'ws') {
      ws = value;
    } else if (key === 'newWorkspace') {
      newWorkspace = value;
    } else if (key === 'newEmail') {
      newEmail = value;
    }
  });
  const { mutateAsync: _getAllTestRuns, isLoading: _isLoading } = useGetTestRunsByFilter();
  useEffect(() => {
    if (!otp && !userDetails?.onboardingSuccessful) {
      const url = `/on-boarding/${userDetails?.email}`;
      window.location.href = url;
    }
  }, [userDetails, otp]);

  const fetchTestRuns = async (filters) => {
    try {
      const response = await _getAllTestRuns(filters);
      setTestRuns((pre) => ({
        ...(pre || {}),
        count: response?.count || 0,
        testruns: [...(pre?.testruns || []), ...response?.testruns],
      }));
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    fetchTestRuns({
      search: '',
      status: [],
      assignedTo: [],
      projectId: [],
      createdBy: [],
      page: 0,
    });
  }, []);

  // NOTE: get Overall analytics
  const { mutateAsync: _getOverAllAnalytics, isLoading: _QaAnalyticsLoading } = useGetOverallAnalytics();
  const fetchAllAnalytics = async () => {
    try {
      const response = await _getOverAllAnalytics();
      setAllAnalytics(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  let hoverTimeout;
  const handleMouseEnter = (id, index) => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setIsHoveringName({ id, index });
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsHoveringName({ id: null, index: null });
  };

  const { data: _userDataById } = useGetUserById(isHoveringName?.id);

  const getUserDetail = async (id) => {
    try {
      const res = await _userDataById(id);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (isHoveringName?.id) {
      getUserDetail(isHoveringName?.id);
    }
  }, []);

  return (
    <>
      {_isLoading || _QaAnalyticsLoading ? (
        <Loader />
      ) : (
        <div className={style.wrapper}>
          <div className={style.wrapperUpper}>
            <div className={style.left}>
              <div className={style.welcomeDiv}>
                <ValueBox className={style.boxWidth} heading={'Projects'} value={allAnalytics?.projects} />
                <ValueBox className={style.boxWidth} heading={'Test Cases'} value={allAnalytics?.testCases} />
                <ValueBox className={style.boxWidth} heading={'Bugs'} value={allAnalytics?.bugs} />
                <ValueBox className={style.boxWidth} heading={'Test Runs'} value={allAnalytics?.testRuns} />
                {userDetails?.role === 'Admin' && (
                  <ValueBox
                    className={style.boxWidth}
                    heading={'Users'}
                    value={`${allAnalytics?.users ? allAnalytics?.users : '-'}/${
                      allAnalytics?.seatsAvailable ? allAnalytics?.seatsAvailable : '-'
                    }`}
                  />
                )}
              </div>
              <div className={style.bugsSection}>
                <div className={style.bugHeader}>
                  <span>Bugs</span>
                </div>
                <div className={style.lowerSection}>
                  <div className={style.innerBug}>
                    <div className={style.status}>Opened</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.open ? allAnalytics?.BugsData?.open : '-'}
                    </span>
                  </div>
                  <div className={style.innerBug}>
                    <div className={style.status}>Reproducible</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.reproducible ? allAnalytics?.BugsData?.reproducible : '-'}
                    </span>
                  </div>
                  <div className={style.innerBug}>
                    <div className={style.status}>Blocked</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.blocked ? allAnalytics?.BugsData?.blocked : '-'}
                    </span>
                  </div>
                  <div className={style.innerBug}>
                    <div className={style.status}>Need to Discuss</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.needToDiscuss ? allAnalytics?.BugsData?.needToDiscuss : '-'}
                    </span>
                  </div>
                  <div className={style.innerBug} style={{ borderRight: 'none' }}>
                    <div className={style.status}>Closed</div>
                    <span className={style.count}>
                      {allAnalytics?.BugsData?.closed ? allAnalytics?.BugsData?.closed : '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className={style.midSection}>
                <div className={style.testCaseSection}>
                  <div className={style.bugHeader}>
                    <span>Test Cases</span>
                  </div>
                  <div className={style.lowerSection}>
                    <div className={style.innerBug}>
                      <div className={style.status}>Failed</div>
                      <span className={style.count}>
                        {allAnalytics?.testCasesData?.failed ? allAnalytics?.testCasesData?.failed : '-'}
                      </span>
                    </div>
                    <div className={style.innerBug}>
                      <div className={style.status}>Blocked</div>
                      <span className={style.count}>
                        {allAnalytics?.testCasesData?.blocked ? allAnalytics?.testCasesData?.blocked : '-'}
                      </span>
                    </div>
                    <div className={style.innerBug}>
                      <div className={style.status}>Not Tested</div>
                      <span className={style.count}>
                        {allAnalytics?.testCasesData?.notTested ? allAnalytics?.testCasesData?.notTested : '-'}
                      </span>
                    </div>

                    <div className={style.innerBug} style={{ borderRight: 'none' }}>
                      <div className={style.status}>Passed</div>
                      <span className={style.count}>
                        {allAnalytics?.testCasesData?.passed ? allAnalytics?.testCasesData?.passed : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={style.testRunsSection}>
                  <div className={style.bugHeader}>
                    <span>Test Runs</span>
                  </div>
                  <div className={style.lowerSection}>
                    <div className={style.innerBug}>
                      <div className={style.status}>Open</div>
                      <span className={style.count}>
                        {allAnalytics?.testRunsData?.open ? allAnalytics?.testRunsData?.open : '-'}
                      </span>
                    </div>
                    <div className={style.innerBug} style={{ borderRight: 'none' }}>
                      <div className={style.status}>Closed</div>
                      <span className={style.count}>
                        {allAnalytics?.testRunsData?.closed ? allAnalytics?.testRunsData?.closed : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.right}>
              <div className={style.upcomingDiv}>
                <div className={style.upcomingHeader}>
                  <span>Overdue Test Runs</span>
                  <img alt="" src={dots} />
                </div>
                <div className={style.upcomingInner}>
                  <Permissions
                    allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                    currentRole={userDetails?.role}
                    // NOTE: accessParticular={userDetails?.current !== 'Free'}
                  >
                    {testRuns.testruns
                      ?.filter((x) => isPast(parseISO(x.dueDate)) && x.status !== 'Closed')
                      ?.map((item, i) => (
                        <Upcoming
                          key={i}
                          id={item?._id}
                          testedCount={item?.testedCount}
                          testCases={item?.testCases}
                          notTestedCount={item?.notTestedCount}
                          title={item?.runId}
                          subTitle={item?.name}
                          date={formattedDate(new Date(item?.dueDate), 'dd MMM, yyyy')}
                          daysPassed={calculateDaysPassed(new Date(item?.dueDate))}
                          overDue={isPast(parseISO(item.dueDate))}
                          img={item?.assignee?.profilePicture}
                          name={item?.assignee?.name}
                          data={item}
                        />
                      ))}
                  </Permissions>
                </div>
              </div>
            </div>
          </div>
          <div className={style.wrapperLower}>
            <div className={style.reportSection}>
              <Permissions
                allowedRoles={['Admin', 'Project Manager', 'QA']}
                currentRole={userDetails?.role}
                locked={userDetails?.activePlan === 'Free'}
              >
                <Report control={control} watch={watch} userDetails={userDetails} />
              </Permissions>
            </div>
            <div className={style.reportSection}>
              <Permissions
                allowedRoles={['Admin', 'Project Manager', 'QA']}
                currentRole={userDetails?.role}
                locked={userDetails?.activePlan === 'Free'}
              >
                <DevReport control={control} watch={watch} userDetails={userDetails} />
              </Permissions>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
