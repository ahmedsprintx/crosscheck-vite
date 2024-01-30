import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

// NOTE: component
import Tabs from 'components/tabs/tabs-second';
import More from './more';
import Milestone from './milestones';
import FilesSection from './files';
import MainWrapper from 'components/layout/main-wrapper';
import TestCases from 'pages/test-cases';
import AddTestCaseData from 'pages/test-cases/add-test-case';
import QaTesting from 'pages/qa-testing';
import StartTesting from 'pages/start-testing';
import TestRuns from 'pages/test-runs';
import TestRunSingle from 'pages/test-runs/single-test-run';
import Tasks from './tasks';
import Activities from 'pages/activities';
import Dashboard from './dashboard';

// NOTE: hooks
import { useGetProjectById } from 'hooks/api-hooks/projects/projects.hook';

// NOTE: utils
import { formattedDate } from 'utils/date-handler';

// NOTE: css
import 'split-pane-react/esm/themes/default.css';
import style from './single-project.module.scss';
import FeedBack from './feedback';
import TabsMobile from 'components/tabs-mobile/tabs-second-mobile';
import { useAppContext } from 'context/app.context';
import { useMemo } from 'react';
import { useDimensions } from 'hooks/use-dimensions';

const SingleProject = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userDetails } = useAppContext();
  const { data: _projectData } = useGetProjectById(id);
  const [activeTab, setActiveTab] = useState(0);

  const active = searchParams.get('active');
  const testCase = searchParams.get('testCase');
  const runId = searchParams.get('runId');
  const testRun = searchParams.get('testRun');
  const bug = searchParams.get('bugs');

  useEffect(() => {
    if (active) {
      setActiveTab(+active);
    }
  }, []);

  useEffect(() => {
    if (activeTab >= 0) {
      setSearchParams({
        active: activeTab,
      });
    }
  }, [activeTab]);

  const pages = useMemo(() => {
    return [
      {
        id: 0,
        cypryssAttr: 'project-header-dashboard',
        tabTitle: 'Dashboard',
        content: activeTab === 0 && <Dashboard />,
      },
      {
        id: 1,
        cypryssAttr: 'project-header-testcases',
        tabTitle: 'Test Cases',
        content:
          activeTab === 1 &&
          (testCase !== 'add' ? <TestCases noHeader projectId={id} /> : <AddTestCaseData noHeader projectId={id} />),
      },
      {
        id: 2,
        cypryssAttr: 'project-header-bugs',
        tabTitle: 'Bugs',
        content:
          activeTab === 2 &&
          (bug !== 'add' ? <QaTesting noHeader projectId={id} /> : <StartTesting noHeader projectId={id} />),
      },

      {
        id: 3,
        cypryssAttr: 'project-header-testruns',
        tabTitle: 'Test Runs',
        content:
          activeTab === 3 &&
          (testRun !== 'view' ? (
            <TestRuns noHeader projectId={id} />
          ) : (
            <TestRunSingle noHeader projectId={id} runId={runId} />
          )),
      },
      {
        id: 4,
        cypryssAttr: 'project-header-milestone',
        tabTitle: 'Milestone',
        content: activeTab === 4 && <Milestone />,
      },
      {
        id: 5,
        cypryssAttr: 'project-header-tasks',
        tabTitle: 'Tasks',
        content: activeTab === 5 && <Tasks noHeader projectId={id} />,
      },
      {
        id: 6,
        cypryssAttr: 'project-header-feedback',
        tabTitle: 'Feedback',
        content: activeTab === 6 && <FeedBack noHeader projectId={id} />,
      },
      userDetails?.activePlan !== 'Free' && {
        id: 7,
        cypryssAttr: 'project-header-activities',
        tabTitle: 'Activities',
        content: activeTab === 7 && <Activities noHeader projectId={id} />,
      },
      {
        id: 8,
        cypryssAttr: 'project-header-files',
        tabTitle: 'Files',
        content: activeTab === 8 && <FilesSection noHeader projectId={id} />,
      },
      {
        id: 9,
        cypryssAttr: 'project-header-more',
        tabTitle: 'More',
        content: activeTab === 9 && <More />,
      },
    ];
  }, [id, testRun, bug, testCase, activeTab]);

  const { width } = useDimensions();

  return (
    <>
      <MainWrapper
        title={_projectData?.name}
        barIcon
        activeTab={active}
        date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
        searchField={
          (pages?.find((x) => x.id === activeTab)?.tabTitle === 'Test Cases' ||
            pages?.find((x) => x.id === activeTab)?.tabTitle === 'Test Runs' ||
            pages?.find((x) => x.id === activeTab)?.tabTitle === 'Bugs' ||
            pages?.find((x) => x.id === activeTab)?.tabTitle === 'Tasks' ||
            pages?.find((x) => x.id === activeTab)?.tabTitle === 'Feedback') &&
          window.innerWidth <= 768
            ? true
            : false
        }
      >
        {width >= 550 ? (
          <div className={style.mainDiv}>
            <Tabs pages={pages?.filter((x) => x.tabTitle)} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        ) : (
          <div className={style.mainDivMobile}>
            <TabsMobile pages={pages?.filter((x) => x.tabTitle)} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        )}
      </MainWrapper>
    </>
  );
};

export default SingleProject;
