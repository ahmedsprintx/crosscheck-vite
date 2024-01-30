import { useState } from 'react';
import PropTypes from 'prop-types';
import style from './drawer.module.scss';
import Tabs from 'components/tabs';
import Detail from './detail';
import More from './more';
import History from './history';
import ReportBug from 'components/report-bug-modal';
import { useToaster } from 'hooks/use-toaster';
import { useGetBugById, useUpdateSeverityBug } from 'hooks/api-hooks/bugs/bugs.hook';
import Tags from 'components/tags';
import ArrowRight from 'components/icon-component/arrow-right';
import ArrowLeft from 'components/icon-component/arrow-left';
import CrossIcon from 'components/icon-component/cross';
import Activities from './activities';

import noData from 'assets/no-found.svg';
import Loader from 'components/loader';

const ViewBug = ({ setDrawerOpen, setViewBugId, viewBugId, noHeader }) => {
  const [bugModal, setBugModal] = useState(false);
  const [activeCross, setActiveCross] = useState(0);

  const { toastError, toastSuccess } = useToaster();

  const { data: _bugDetailsData = {}, refetch, isLoading } = useGetBugById(viewBugId);

  const { bug = {} } = _bugDetailsData;

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
              id={'prevButton'}
              className={style.hover}
              onClick={() => bug?.previousBug?.[0]?._id && setViewBugId(bug?.previousBug?.[0]?._id)}
            >
              <ArrowLeft />
              <div className={style.tooltip}>
                <p>Back</p>
              </div>
            </div>
            <span className={style.headerText}>{bug.bugId}</span>
            <div
              id={'nextButton'}
              className={style.hover}
              onClick={() => bug?.nextBug?.[0]?._id && setViewBugId(bug?.nextBug?.[0]?._id)}
            >
              <ArrowRight />
              <div className={style.tooltip}>
                <p>Next</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setDrawerOpen(false);
              setViewBugId('');
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
                  <span>Project</span> <span className={style.span2}>{bug?.projectId?.name}</span>
                </div>

                <div className={style.innerLeftWrapper}>
                  <span>Milestone</span> <span className={style.span2}>{bug?.milestoneId?.name}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Feature</span> <span className={style.span2}>{bug?.featureId?.name}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Bug Type</span> <span className={style.span2}>{bug?.bugType}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Bug Subtype</span>
                  <span className={style.span2}>{bug?.bugSubType}</span>
                </div>

                <div className={style.innerLeftWrapper}>
                  <span>Severity</span>
                  <span className={style.span2}>
                    <span className={`${style.span2} ${style.tagText}`}>
                      {' '}
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
                  </span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span> Task ID</span> <span className={style.span2}>{bug?.taskId}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Developer Name</span> <span className={style.span2}>{bug?.developerId?.name}</span>
                </div>
                <div className={style.innerLeftWrapper}>
                  <span>Status</span>{' '}
                  <span className={`${style.span2} ${style.tagText}`}>
                    {' '}
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
              <Tabs pages={pages(bug)} activeTab={activeCross} setActiveTab={setActiveCross} />
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
    </>
  );
};
ViewBug.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  setViewBugId: PropTypes.func.isRequired,
  viewBugId: PropTypes.string.isRequired,
  noHeader: PropTypes.bool,
};

export default ViewBug;

const pages = (data) => [
  {
    tabTitle: 'Detail',
    content: <Detail data={data} />,
  },
  {
    tabTitle: 'History',
    content: <History data={data} />,
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
