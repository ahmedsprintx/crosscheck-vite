import style from './testing.module.scss';
import Checkbox from 'components/checkbox';
import { formattedDate } from 'utils/date-handler';
import Tags from 'components/tags';
import _ from 'lodash';
import EditIcon from 'components/icon-component/edit-icon';
import DelIcon from 'components/icon-component/del-icon';
import ReopenIcon from 'components/icon-component/reopen-icon';
import TestCaseIcon from 'components/icon-component/test-case-dark';
import RetestIcon from 'components/icon-component/retest-icon';
import Permissions from 'components/permissions';
import UserName from 'components/user-name';
import Attach from 'components/icon-component/attach';
import Highlighter from 'components/highlighter';
import EvidenceLink from 'components/icon-component/evidence-link';
import Copy1Icon from 'components/icon-component/copy';
import CreateTask from 'components/icon-component/create-task';
import TestRunIcon from 'components/icon-component/test-run';
import ConvertIcon from 'components/icon-component/convert-icon';

export const initialFilters = {
  projects: [],
  milestones: [],
  features: [],
  status: [],
  bugType: [],
  severity: [],
  testingType: [],
  assignedTo: [],
  reportedBy: [],
  bugBy: [],
  issueType: [],
  page: 1,
  perPage: 25,
  reportedAt: { start: null, end: null },
  closedDate: { start: null, end: null },
  reTestDate: { start: null, end: null },
  taskId: '',
};

export const columnsData = ({
  setAddTestCase,
  setSearchParams,
  setOpenDelModal,
  setViewBug,
  setEditRecord,
  bugs,
  isHoveringName,
  setIsHoveringName,
  setSelectedBugs,
  selectedRecords,
  setSelectedRecords,
  searchedText,
  setRetestOpen,
  role,
  activePlan,
  onChangeSeverity,
  noHeader,
}) => [
  {
    name: (
      <Checkbox
        checked={bugs?.some((bug) => selectedRecords.includes(bug?._id))}
        partial={bugs?.some((bug) => selectedRecords.includes(bug?._id)) && bugs?.length !== selectedRecords?.length}
        handleChange={(e) => {
          setSelectedRecords(() => (e.target.checked ? bugs?.map((x) => x._id) : []));
          setSelectedBugs(() => (e.target.checked ? bugs?.map((x) => x) : []));
        }}
      />
    ),
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '25px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div style={{ minWidth: '35px' }}>
          <Checkbox
            checked={selectedRecords.includes(row?._id)}
            name={row?._id}
            handleChange={(e) => {
              setSelectedRecords((pre) =>
                pre.includes(row?._id) ? pre.filter((x) => x !== row?._id) : [...pre, row?._id],
              );
              if (e.target.checked) {
                setSelectedBugs((prev) => [...prev, row]);
              } else {
                setSelectedBugs((prev) => prev.filter((selectedBug) => selectedBug?._id !== row?._id));
              }
            }}
          />
        </div>
      );
    },
  },
  {
    name: 'Bug #',
    key: 'bugId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div
          className={style.imgDiv}
          style={{
            cursor: 'pointer',
          }}
          onClick={() => {
            setSearchParams({
              bugId: row?.bugId,
            });
          }}
        >
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.bugId}</Highlighter>
          </p>
        </div>
      );
    },
  },
  !noHeader && {
    name: 'Project',
    key: 'projectId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.projectId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Milestone',
    key: 'milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.milestoneId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Feature',
    key: 'featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.featureId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Testing Type',
    key: 'testingType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '210px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testingType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Issue Type',
    key: 'issueType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.issueType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Ticket ID',
    key: 'taskId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.taskId}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Developer Name',
    key: 'developerId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.developerId?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };
      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              searchedText={searchedText}
              user={row?.developerId}
              isHovering={
                isHoveringName?.userId === row?.developerId?._id && isHoveringName?.rowId === row?._id
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Bug Type',
    key: 'bugType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.bugType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Bug Sub Type',
    key: 'bugSubType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.bugSubType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Bug Feedback',
    key: 'feedback.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.feedback?.text}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Steps to Reproduce',
    key: 'reproduceSteps.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.reproduceSteps?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Ideal Behaviour',
    key: 'idealBehaviour.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '240px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.idealBehaviour?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Tested Version',
    key: 'testedVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testedVersion}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Evidence',
    key: 'testEvidence',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>
            {row?.history[row?.history?.length - 1]?.reTestEvidence || row?.testEvidence}
          </Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Reported Date',
    key: 'reportedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>
            {row?.reportedAt ? formattedDate(row?.reportedAt, 'dd MMM, yy') : '-'}
          </Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Reported By',
    key: 'reportedBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.reportedBy?._id,
            rowId: row?._id,
            columnName: 'Reported By',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };
      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              searchedText={searchedText}
              user={row?.reportedBy}
              isHovering={
                isHoveringName?.userId === row?.reportedBy?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Reported By'
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Severity',
    key: 'severity',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <div style={{ cursor: 'pointer' }}>
            <Tags
              droppable
              menu={[
                {
                  title: 'Low',
                  click: () => {
                    onChangeSeverity(row?._id, 'Low');
                  },
                },
                {
                  title: 'Medium',
                  click: () => {
                    onChangeSeverity(row?._id, 'Medium');
                  },
                },
                {
                  title: 'High',
                  click: () => {
                    onChangeSeverity(row?._id, 'High');
                  },
                },

                {
                  title: 'Critical',
                  click: () => {
                    onChangeSeverity(row?._id, 'Critical');
                  },
                },
              ]}
              text={row?.severity}
              colorScheme={{
                Low: '#4F4F6E',
                High: '#F96E6E',
                Medium: '#B79C11',
                Critical: '#F80101',
              }}
            />
          </div>
        </p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv} onClick={() => setRetestOpen(() => ({ open: true, id: row?._id }))}>
        <p className={style.userName}></p>
        <div style={{ cursor: 'pointer' }}>
          <Tags
            text={row?.status}
            colorScheme={{
              Closed: '#34C369',
              Open: '#F96E6E',
              Blocked: '#F96E6E',
              Reproducible: '#B79C11',
              'Need To Discuss': '#11103D',
            }}
          />
        </div>
      </div>
    ),
  },
  {
    name: 'Assigned to',
    key: 'taskHistory.0.assignedTo.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.taskHistory?.[0]?.assignedTo?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };
      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              searchedText={searchedText}
              user={row?.taskHistory?.[0]?.assignedTo}
              isHovering={
                isHoveringName?.userId === row?.taskHistory?.[0]?.assignedTo?._id && isHoveringName?.rowId === row?._id
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Assigned Ticket ID',
    key: 'taskHistory.0.taskId.customId' || 'taskHistory.0.taskId.id',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <a
            href={row?.taskHistory?.[0]?.taskId?.url}
            target="_blank"
            style={{
              textDecoration: 'underline',
              color: 'black',
            }}
            rel="noreferrer"
          >
            <Highlighter search={searchedText}>
              {row?.taskHistory?.[0]?.taskId?.customId || row?.taskHistory?.[0]?.taskId?.id}
            </Highlighter>
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest Date',
    key: 'history.0.reTestDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {formattedDate(row?.history[_.findLastIndex(row?.history)]?.reTestDate, 'dd MMM, yy')}
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest by',
    key: 'history.0.reTestBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.history[_.findLastIndex(row?.history)]?.reTestBy?._id,
            rowId: row?._id,
            columnName: 'Last Retest by',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };
      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              user={row?.history[_.findLastIndex(row?.history)]?.reTestBy}
              isHovering={
                isHoveringName?.userId === row?.history[_.findLastIndex(row?.history)]?.reTestBy?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Last Retest by'
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Closed Date',
    key: 'closed.date',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}> {formattedDate(row?.closed?.date, 'dd MMM, yy')}</p>
      </div>
    ),
  },
  {
    name: 'Closed Version',
    key: 'closed.version',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '170px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.closed?.version}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Closed By',
    key: 'closed.by.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.closed?.by?._id,
            rowId: row?._id,
            columnName: 'Closed By',
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };
      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              user={row?.closed?.by}
              isHovering={
                isHoveringName?.userId === row?.closed?.by?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Closed By'
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Actions',
    key: 'actions',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={role}>
          <div className={style.imgDiv1}>
            <div className={style.img}>
              <div
                onClick={() =>
                  window.open(row?.history[row?.history?.length - 1]?.reTestEvidence || row?.testEvidence, '_blank')
                }
              >
                <Attach />
              </div>

              <div className={style.tooltip}>
                <p>Latest Evidence</p>
              </div>
            </div>
            <div className={style.img}>
              <div
                onClick={() => setRetestOpen(() => ({ open: true, id: row?._id }))}
                data-cy={`bugreporting-retest-icon${row?.index}`}
              >
                <RetestIcon />
              </div>

              <div className={style.tooltip}>
                <p>Retest</p>
              </div>
            </div>
            <div
              className={style.img}
              onClick={() => {
                setEditRecord({ id: row?._id });
                setViewBug(true);
              }}
              data-cy={`bugreporting-edit1-icon${row?.index}`}
            >
              <div>
                <EditIcon />
              </div>
              <div className={style.tooltip}>
                <p>Edit</p>
              </div>
            </div>
            {row.status !== 'Open' && (
              <div
                className={style.img}
                onClick={() => {
                  setEditRecord({ id: row?._id, reopen: true });
                  setViewBug(true);
                }}
              >
                <div>
                  <ReopenIcon />
                </div>

                <div className={style.tooltip}>
                  <p>Reopen</p>
                </div>
              </div>
            )}
            <Permissions
              allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
              currentRole={role}
              locked={activePlan === 'Free'}
            >
              <div className={style.img}>
                <div
                  onClick={() => {
                    setAddTestCase({ id: row?._id, reopen: true });
                    setViewBug(true);
                  }}
                  data-cy={`bugreporting-addtestcase-icon${row?.index}`}
                >
                  <TestCaseIcon />
                </div>

                <div className={style.tooltip}>
                  <p>Test Case</p>
                </div>
              </div>
            </Permissions>
            <div className={style.img}>
              <div
                className={style.imgDel}
                onClick={() =>
                  setOpenDelModal({
                    open: true,
                    name: row?.testCaseId,
                    id: row?._id,
                  })
                }
                data-cy={`bugreporting-del-icon${row?.index}`}
              >
                <DelIcon />
              </div>

              <div className={style.tooltip}>
                <p>Delete</p>
              </div>
            </div>
          </div>
        </Permissions>
      </>
    ),
  },
];

export const menuData = [
  {
    border: '1px solid #D6D6D6',
    bodyData: [
      {
        icon: <EditIcon backClass={style.editColor} />,
        text: 'Edit',
      },
      {
        icon: <RetestIcon backClass={style.editColor} backClass1={style.retestColor} />,
        text: 'Retest',
      },
      {
        icon: <ReopenIcon backClass={style.editColor} />,
        text: 'Reopen',
      },
      {
        icon: <EvidenceLink backClass={style.editColor} />,
        text: 'View Evidence',
      },
      {
        icon: <Copy1Icon backClass={style.editColor} />,
        text: 'Copy Evidence Link',
      },
    ],
  },
  {
    border: '1px solid #D6D6D6',
    bodyData: [
      {
        icon: <CreateTask backClass={style.editColor} />,
        text: 'Create Task',
      },
      {
        icon: <TestRunIcon backClass={style.editColor} />,
        text: 'Create Test Run',
      },
      {
        icon: <ConvertIcon backClass={style.editColor} />,
        text: 'Convert to Test Case',
      },
    ],
  },
  {
    bodyData: [
      {
        icon: <DelIcon backClass={style.editColor1} />,
        text: 'Delete',
      },
    ],
  },
];
