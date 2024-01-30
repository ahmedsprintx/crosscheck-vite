import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ReportBug from 'components/report-bug-modal';
import ArrowRight from 'components/icon-component/arrow-right';
import ArrowLeft from 'components/icon-component/arrow-left';
import CrossIcon from 'components/icon-component/cross';
import Dots from 'components/icon-component/dots';

import RetestIcon from 'components/icon-component/retest-icon';
import EditIcon from 'components/icon-component/edit-icon';
import ReopenIcon from 'components/icon-component/reopen-icon';
import DelIcon from 'components/icon-component/del-icon';
import TestCaseIcon from 'components/icon-component/test-case-dark';
import Detail from './detail';
import More from './more';
import History from './history';
import Activities from './activities';
import TaskHistory from './task-history';
import Comments from './comments';

import { useGetBugById, useUpdateSeverityBug } from 'hooks/api-hooks/bugs/bugs.hook';

import style from './drawer.module.scss';

import noData from 'assets/no-found.svg';
import Loader from 'components/loader';
import { useAppContext } from 'context/app.context';
import Menu from 'components/menu';
import Tags from 'components/tags';
import TabsMobile from 'components/tabs-mobile';
import { useToaster } from 'hooks/use-toaster';

const ViewBug = ({
  setDrawerOpen,
  setAddTestCase,
  setViewBugId,
  viewBugId,
  setViewBug,
  noHeader,
  setRetestOpen,
  setOpenDelModal,
  setEditRecord,
}) => {
  const [bugModal, setBugModal] = useState(false);
  const [activeCross, setActiveCross] = useState(0);
  const { userDetails } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState();
  const bugId = searchParams.get('bugId');
  const { data: _bugDetailsData = {}, isLoading, refetch } = useGetBugById(viewBugId);

  const { toastSuccess, toastError } = useToaster();

  const { bug = {} } = _bugDetailsData;

  const option = [
    {
      title: 'Retest',
      compo: (
        <div id="retestButton">
          <RetestIcon />
        </div>
      ),
      click: () => {
        setRetestOpen((pre) => ({ open: true, id: bug?._id, refetch }));
        setOpen(false);
      },
    },
    {
      title: 'Edit',
      compo: (
        <div>
          <EditIcon />
        </div>
      ),
      click: () => {
        setEditRecord({ id: bug?._id, refetch });
        setViewBug(true);
        setOpen(false);
      },
    },
    {
      title: 'Reopen',
      compo: (
        <div id="reopenButton">
          <ReopenIcon />
        </div>
      ),
      click: () => {
        setEditRecord({ id: bug?._id, reopen: true });
        setViewBug(true);
        setOpen(false);
      },
    },
    {
      ...(['Admin', 'Project Manager', 'QA', 'Developer'].includes(userDetails?.role) &&
        !userDetails?.activePlan === 'Free' && {
          title: 'Convert to Test Case',
          compo: (
            <div
              onClick={() => {
                setAddTestCase({ id: bug?._id, reopen: true });
                setOpen(false);
              }}
              className={style.hover}
            >
              <TestCaseIcon />
              <div className={style.tooltip}>
                <p>Convert to Test Case</p>
              </div>
            </div>
          ),
        }),
    },
    {
      title: 'Delete',
      compo: (
        <div className={style.delIcon}>
          <DelIcon />
        </div>
      ),
      click: () =>
        setOpenDelModal({
          open: true,
          id: bug?._id,
        }),
    },
  ];

  const { mutateAsync: _changeSeverityHandler } = useUpdateSeverityBug();

  const onChangeSeverity = async (id, value) => {
    try {
      const res = await _changeSeverityHandler({ id, body: { newSeverity: value } });
      toastSuccess(res.msg);

      await refetch();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div
              className={style.hover}
              id={'prevButton'}
              onClick={() => {
                if (bug?.previousBug?.[0]?._id && bugId) {
                  setSearchParams({
                    bugId: bug?.previousBug?.[0]?.bugId,
                  });
                } else if (bug?.previousBug?.[0]?._id) {
                  setViewBugId(bug?.previousBug?.[0]?._id);
                }
              }}
            >
              <ArrowLeft type={!bug?.previousBug?.[0]?._id} />
              <div className={style.tooltip}>
                <p>Back</p>
              </div>
            </div>
            <span className={style.headerText}>{bug.bugId}</span>
            <div
              className={style.hover}
              id={'nextButton'}
              onClick={() => {
                if (bug?.nextBug?.[0]?._id && bugId) {
                  setSearchParams({
                    bugId: bug?.nextBug?.[0]?.bugId,
                  });
                } else if (bug?.nextBug?.[0]?._id) {
                  setViewBugId(bug?.nextBug?.[0]?._id);
                }
              }}
            >
              <ArrowRight type={!bug?.nextBug?.[0]?._id} />
              <div className={style.tooltip}>
                <p>Next</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setDrawerOpen(false);
              setViewBugId('');
              if (bugId) {
                setSearchParams({});
              }
            }}
            className={style.hover1}
          >
            <CrossIcon />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        {bug?._id && !isLoading ? (
          <div
            className={style.body}
            style={{
              height: noHeader ? '78vh' : '90vh',
              overflowY: 'auto',
            }}
          >
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <div className={style.innerLeftWrapper}>
                  <span>Project</span>{' '}
                  <span className={style.span2}>
                    {bug?.projectId?.name ? bug?.projectId?.name : '-'}
                  </span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Milestone</span>{' '}
                  <span className={style.span2}>
                    {bug?.milestoneId?.name ? bug?.milestoneId?.name : '-'}
                  </span>
                </div>

                <div className={style.innerLeftWrapper}>
                  <span>Feature</span>{' '}
                  <span className={style.span2}>
                    {bug?.featureId?.name ? bug?.featureId?.name : '-'}
                  </span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Bug Type</span>{' '}
                  <span className={style.span2}>{bug?.bugType ? bug?.bugType : '-'}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Bug Subtype</span>
                  <span className={style.span2}>{bug?.bugSubType ? bug?.bugSubType : '-'}</span>
                </div>

                <div className={style.innerLeftWrapper}>
                  <span>Severity</span>
                  <span className={`${style.span2} ${style.tagText}`}>
                    <Tags
                      droppable
                      menu={[
                        {
                          title: 'Low',
                          click: () => {
                            onChangeSeverity(bug?._id, 'Low');
                          },
                        },
                        {
                          title: 'Medium',
                          click: () => {
                            onChangeSeverity(bug?._id, 'Medium');
                          },
                        },
                        {
                          title: 'High',
                          click: () => {
                            onChangeSeverity(bug?._id, 'High');
                          },
                        },

                        {
                          title: 'Critical',
                          click: () => {
                            onChangeSeverity(bug?._id, 'Critical');
                          },
                        },
                      ]}
                      backClass={style.tagStyle}
                      text={bug?.severity}
                      colorScheme={{
                        Low: '#4F4F6E',
                        High: '#F96E6E',
                        Medium: '#B79C11',
                        Critical: '#F80101',
                      }}
                    />
                  </span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span> Task ID</span>{' '}
                  <span className={style.span2}>{bug?.taskId ? bug?.taskId : '-'}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Developer Name</span>{' '}
                  <span className={style.span2}>
                    {bug?.developerId?.name ? bug?.developerId?.name : '-'}
                  </span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Status</span>{' '}
                  <span
                    className={`${style.span2} ${style.tagText}`}
                    onClick={() => {
                      setRetestOpen((pre) => ({ open: true, id: bug?._id, refetch }));
                      setOpen(false);
                    }}
                  >
                    <Tags
                      text={bug?.status}
                      backClass={style.tagStyle}
                      colorScheme={{
                        Closed: '#34C369',
                        Open: '#F96E6E',
                        Blocked: '#F96E6E',
                        Reproducible: '#B79C11',
                        'Need To Discuss': '#11103D',
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className={style.tabsDiv}>
              <div className={style.tabsIconDiv}>
                <div
                  className={style.hover}
                  onClick={() => {
                    setOpen((pre) => !pre);
                  }}
                >
                  <Dots />
                  <div className={style.tooltip}>
                    <p>Menu</p>
                  </div>
                </div>
              </div>
              <div className={style.menuDiv}>
                {open && <Menu menu={option.filter((x) => x.title)} />}
              </div>

              <TabsMobile
                pages={pages(bug)}
                activeTab={activeCross}
                setActiveTab={setActiveCross}
                drawerMode
              />
            </div>
          </div>
        ) : isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'calc(100vh - 265px)',
            }}
          >
            <Loader />
          </div>
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
      <ReportBug openDelModal={bugModal} setOpenDelModal={setBugModal} />
      {open && <div className={style.backdropDiv} onClick={() => setOpen(false)}></div>}
    </>
  );
};

export default ViewBug;

const pages = (data) => [
  {
    tabTitle: 'Detail',
    content: (
      <Detail
        feedback={data?.feedback}
        reproduceSteps={data?.reproduceSteps}
        idealBehaviour={data?.idealBehaviour}
        testEvidence={data?.testEvidence}
        testEvidenceKey={data?.testEvidenceKey}
        testedVersion={data?.testedVersion}
        history={data?.history}
      />
    ),
  },
  {
    tabTitle: 'Task History',
    content: <TaskHistory taskHistory={data?.taskHistory} />,
  },
  {
    tabTitle: 'Comments',
    content: <Comments bugId={data?._id} />,
  },
  {
    tabTitle: 'History',
    content: <History history={data.history} />,
  },
  {
    tabTitle: 'Activities',
    content: <Activities noHeader bugId={data?._id} />,
  },
  {
    tabTitle: 'More',
    content: <More data={data} />,
  },
];
