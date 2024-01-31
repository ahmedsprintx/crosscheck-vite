import MainWrapper from 'components/layout/main-wrapper';
import React, { useState , useRef , useMemo , useEffect } from 'react';
// NOTE: components
import Button from 'components/button';
import WidgetConfig from './widget-configrations';
// NOTE: styles
import style from './tasks.module.scss';
import styles from './test.module.scss';
import { useGetWidgetConfig } from 'hooks/api-hooks/projects/widget.hook';
import ExportIcon from 'components/icon-component/export-icon';
import { useDeleteFeedBacks, useGetFeedBacks } from 'hooks/api-hooks/projects/feedbacks.hook';
import Loader from 'components/loader';
// NOTE: import _ from 'lodash';

import { debounce as _debounce } from 'utils/lodash';
import { useAppContext } from 'context/app.context';
import Permissions from 'components/permissions';

import noData from 'assets/no-found.svg';
import { CSVLink } from 'react-csv';
import { useToaster } from 'hooks/use-toaster';
import deleteBtn from 'assets/deleteButton.svg';
import DelIcon from 'components/icon-component/del-icon';
import PlusIcon from 'components/icon-component/plus-icon';

import { columnsData, useProjectOptions } from './helper';
import GenericTable from 'components/generic-table';
import DeleteModal from 'components/delete-modal';
import { formattedDate } from 'utils/date-handler';

import SplitPane from 'components/split-pane/split-pane';
import ReportBug from './report-bug';

const FeedBack = ({ noHeader, projectId }) => {
  const [widget, setWidget] = useState(false);
  const ref = useRef();
  const containerRef = useRef();
  const { userDetails } = useAppContext();
  const { toastError, toastSuccess } = useToaster();

  const { data = {} } = useProjectOptions();

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [delModal, setDelModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [search, setSearch] = useState('');
  const [reportBug, setReportBug] = useState(false);
  const [editRecord, setEditRecord] = useState('');

  const { data: _widgetConfig, refetch } = useGetWidgetConfig(projectId);
  const { mutateAsync: _deleteFeedbackHandler, isLoading: _isDeleteLoading } = useDeleteFeedBacks();
  const {
    data: _feedbacks,
    refetch: _refetchFeedbacks,
    isLoading: _isLoading,
    isFetching: _isFetching,
  } = useGetFeedBacks({ projectId, search });

  const [sizes, setSizes] = useState(['20%', 'auto']);

  useEffect(() => {
    if (reportBug) {
      setSizes(['65%', '35%']);
    } else {
      setSizes(['100%', '0%']);
    }
  }, [reportBug]);

  const onDelete = async (e, bulk) => {
    try {
      const res = await _deleteFeedbackHandler({
        toDelete: bulk ? selectedRecords : [delModal?.id],
      });
      toastSuccess(res.msg);
      await _refetchFeedbacks();
      setDelModal((pre) => ({ open: false }));
      bulk && setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  };
  const csvData = useMemo(() => {
    return _feedbacks?.feedBacks?.length > 0
      ? _feedbacks?.feedBacks?.map((x) => ({
          title: x.title,
          description: x.description,

          attachment: x.attachment,
          reportedAt: formattedDate(x?.reportedAt, 'dd MMM , yy') || '',
        }))
      : [];
  }, [_feedbacks]);

  const copyToClipboard = () => {
    const textToWrite = `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?
      family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,
      100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
    <script type="module" src="${_widgetConfig?.widgetFound?.widgetLink}">
    </script>`;

    navigator.clipboard.writeText(textToWrite);
  };

  return (
    <>
      <div
        style={{
          height: !noHeader ? '100vh' : '92vh',
          overflowX: 'hidden',
        }}
      >
        <SplitPane sizes={sizes} onChange={setSizes} allowResize={reportBug}>
          <MainWrapper
            title={'FeedBacks'}
            stylesBack={noHeader ? { marginTop: '10px' } : {}}
            noHeader={noHeader}
            searchField
            onSearch={_debounce((e) => {
              setSearch(e.target.value);
            }, 1000)}
            onClear={_debounce((e) => {
              setSearch('');
            }, 1000)}
          >
            {!widget ? (
              <>
                <div className={style.main}>
                  <Permissions
                    allowedRoles={['Admin', 'Project Manager', 'QA']}
                    currentRole={userDetails?.role}
                    locked={userDetails?.activePlan === 'Free'}
                  >
                    <div className={style.mainClassContainer}>
                      <Button text="Feedback Widget" handleClick={() => setWidget(true)} btnClass={style.btnMain} />
                      {_widgetConfig?.widgetFound?._id && (
                        <Button text="Copy Code" btnClass={style.btn} handleClick={copyToClipboard} />
                      )}
                    </div>
                  </Permissions>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    {csvData.length > 0 ? (
                      <Permissions
                        allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                        currentRole={userDetails?.role}
                        locked={userDetails?.activePlan === 'Free'}
                      >
                        <CSVLink data={csvData} filename={`Feedback Export File ${new Date()}`}>
                          <Button text="Export" startCompo={<ExportIcon />} btnClass={style.btn} />
                        </CSVLink>
                      </Permissions>
                    ) : (
                      <Permissions
                        allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                        currentRole={userDetails?.role}
                        locked={userDetails?.activePlan === 'Free'}
                      >
                        <Button
                          text="Export"
                          startCompo={<ExportIcon />}
                          btnClass={style.btn}
                          handleClick={() => {
                            toastError({ msg: 'No Data available to export' });
                          }}
                        />
                      </Permissions>
                    )}
                  </div>
                </div>

                {_isLoading || _isFetching ? (
                  <Loader />
                ) : (
                  <>
                    {_feedbacks?.feedBacks?.length ? (
                      <div>
                        <div
                          className={style.mainClass}
                          style={{
                            marginTop: '10px',
                            width: '100%',
                          }}
                        >
                          <h6>
                            FeedBacks ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                            {_feedbacks?.feedBacks?.length})
                          </h6>
                          <div className={style.flex}>
                            {selectedRecords.length > 0 && projectId && (
                              <div onClick={() => setOpenTaskModal({ open: true })} className={style.addTask}>
                                <PlusIcon />
                                <span>Task</span>
                              </div>
                            )}
                            {selectedRecords.length > 0 && (
                              <Permissions
                                allowedRoles={['Admin', 'Project Manager', 'QA']}
                                currentRole={userDetails?.role}
                              >
                                <div
                                  className={style.change}
                                  src={deleteBtn}
                                  id={'deleteButton'}
                                  alt=""
                                  style={{
                                    cursor: 'pointer',
                                    height: '30px',
                                    width: '36px',
                                    border: '1px solid var(--text-color3)',
                                    borderRadius: '3px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  onClick={() =>
                                    selectedRecords.length > 0
                                      ? setDelModal({ open: true, bulk: true })
                                      : toastError({
                                          msg: 'Select Test Cases to delete',
                                        })
                                  }
                                >
                                  <div className={style.imgDel}>
                                    <DelIcon />
                                  </div>
                                  <div className={style.tooltip}>
                                    <p>Delete</p>
                                  </div>
                                </div>
                              </Permissions>
                            )}
                          </div>
                        </div>
                        <div className={style.tableWidth} style={{ position: 'relative' }}>
                          <GenericTable
                            containerRef={containerRef}
                            ref={ref}
                            columns={columnsData({
                              feedbacks: _feedbacks?.feedBacks,
                              setSelectedRecords,
                              selectedRecords,
                              delModal,
                              setDelModal,
                              setReportBug,
                              setEditRecord,
                              searchedText: search,
                              role: userDetails?.role,
                              activePlan: userDetails?.role,
                            })}
                            dataSource={_feedbacks?.feedBacks || []}
                            height={noHeader ? 'calc(100vh - 240px)' : 'calc(100vh - 267px)'}
                            selectable={true}
                            classes={{
                              test: styles.test,
                              table: styles.table,
                              thead: styles.thead,
                              th: styles.th,
                              containerClass: styles.checkboxContainer,
                              tableBody: styles.tableRow,
                            }}
                          />
                        </div>
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
                  </>
                )}
              </>
            ) : (
              <WidgetConfig
                refetch={refetch}
                _widgetConfig={_widgetConfig}
                setWidget={setWidget}
                projectId={projectId}
                copyToClipboard={copyToClipboard}
              />
            )}
          </MainWrapper>
          <div className={style.flex1}>
            {reportBug && (
              <ReportBug
                noHeader={noHeader}
                options={data}
                editRecord={editRecord}
                setReportBug={setReportBug}
                setEditRecord={setEditRecord}
              />
            )}
          </div>
        </SplitPane>
      </div>

      <DeleteModal
        openDelModal={!!delModal.open}
        setOpenDelModal={() => setDelModal({ open: false })}
        name="Feedback"
        clickHandler={(e) => onDelete(e, delModal.bulk)}
        cancelText="No, Keep this Feedback"
        isLoading={_isDeleteLoading}
      />
    </>
  );
};

export default FeedBack;
