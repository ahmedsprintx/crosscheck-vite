import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import style from './test-runs.module.scss';
import Checkbox from 'components/checkbox';
import { formattedDate } from 'utils/date-handler';
import MultiColorProgressBar from 'components/progress-bar';
import { getUsers } from 'api/v1/settings/user-management';
import { useQuery } from 'react-query';

import _ from 'lodash';
import Tags from 'components/tags';
import Permissions from 'components/permissions';
import EditIcon from 'components/icon-component/edit-icon';
import DelIcon from 'components/icon-component/del-icon';
import UserName from 'components/user-name';
import Highlighter from 'components/highlighter';

export const initialFilter = {
  search: '',
  status: [],
  assignedTo: [],
  createdBy: [],
  projectId: [],
  page: 1,
  perPage: 25,
};

export function useProjectOptions() {
  return useQuery({
    queryKey: ['testRunOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();
      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x) => ({
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const mileStonesOptions =
        _getProjectsMilestonesFeatures?.allMilestones?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const featuresOptions =
        _getProjectsMilestonesFeatures?.allFeatures?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
          checkbox: true,
        })) || [];

      const statusOptions = [
        { label: 'Open', value: 'Open', checkbox: true },
        { label: 'Closed', value: 'Closed', checkbox: true },
      ];

      const priorityOptions = [
        { label: 'High', value: 'High', checkbox: true },
        { label: 'Medium', value: 'Medium', checkbox: true },
        { label: 'Low', value: 'Low', checkbox: true },
      ];

      const bugTypeOptions = [
        { label: 'Functionality', value: 'Functionality', checkbox: true },
        { label: 'Performance', value: 'Performance', checkbox: true },
        { label: 'UI', value: 'UI', checkbox: true },
        { label: 'Security', value: 'Security', checkbox: true },
      ];
      const testTypeOptions = [
        {
          label: 'Functional Testing',
          value: 'Functional Testing',
          checkbox: true,
        },
        {
          label: 'Regression Testing',
          value: 'Regression Testing',
          checkbox: true,
        },
        {
          label: 'Integration Testing',
          value: 'Integration Testing',
          checkbox: true,
        },
        {
          label: 'User Acceptance Testing',
          value: 'User Acceptance Testing',
          checkbox: true,
        },
      ];

      const severityOptions = [
        { label: 'Critical', value: 'Critical', checkbox: true },
        { label: 'High', value: 'High', checkbox: true },
        { label: 'Medium', value: 'Medium', checkbox: true },
        { label: 'Low', value: 'Low', checkbox: true },
      ];
      return {
        priorityOptions,
        bugTypeOptions,
        testTypeOptions,
        severityOptions,
        projectOptions,
        mileStonesOptions,
        featuresOptions,
        statusOptions,
        createdByOptions: users
          .filter((x) => x.role !== 'Developer')
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        assignedTo: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
      };
    },
    refetchOnWindowFocus: false,
  });
}

export const columnsData = ({
  navigate,
  testRuns,
  setAllowResize,
  allowResize,
  setEditRecord,
  searchedText,
  setDelModal,
  setSelectedRecords,
  selectedRecords,
  isHoveringName,
  setIsHoveringName,
  noHeader,
  searchParams,
  setSearchParams,
  role,
  onChangePriority,
  userDetails,
}) => [
  {
    name: (
      <Checkbox
        checked={testRuns?.some((testRun) => selectedRecords.includes(testRun._id))}
        partial={
          testRuns?.some((testRun) => selectedRecords.includes(testRun._id)) &&
          testRuns?.length !== selectedRecords?.length
        }
        handleChange={(e) => {
          setSelectedRecords(() => (e.target.checked ? testRuns.map((x) => x._id) : []));
        }}
      />
    ),
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '36px', height: '36px' },
    widthInEditMode: { width: '182px' },

    render: ({ row }) => {
      return (
        <div className={style.imgDiv} style={{ minWidth: '50px' }}>
          <Checkbox
            checked={selectedRecords.includes(row._id)}
            name={row?._id}
            handleChange={() => {
              setSelectedRecords((pre) =>
                pre.includes(row._id) ? pre.filter((x) => x !== row._id) : [...pre, row._id],
              );
            }}
          />
        </div>
      );
    },
  },

  {
    name: 'Run ID',
    key: 'runId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '90px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p
          className={style.userName}
          style={{ cursor: 'pointer' }}
          onClick={() =>
            !noHeader
              ? navigate(`/test-run/${row?._id}`)
              : setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  testRun: 'view',
                  runId: `${row?._id}`,
                })
          }
        >
          <Highlighter search={searchedText}>{row?.runId}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Run Title',
    key: 'name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '225px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p
          className={style.userName}
          style={{ cursor: 'pointer' }}
          onClick={() =>
            !noHeader
              ? navigate(`/test-run/${row?._id}`)
              : setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  testRun: 'view',
                  runId: `${row?._id}`,
                })
          }
        >
          <Highlighter search={searchedText}>{row?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Cases',
    key: 'testCases.length',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testCases?.length}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Progress',
    key: 'testedCount',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '210px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.multi} style={{ minWidth: '200px' }}>
        <p className={style.userName} style={{ minWidth: '200px' }}>
          <MultiColorProgressBar
            readings={
              !row?.testedCount && !row?.notTestedCount
                ? [
                    {
                      name: 'No Test Case',
                      value: 100,
                      color: '#D6D6D6',
                      tooltip: `No test case`,
                    },
                  ]
                : [
                    row?.testedCount && {
                      name: 'testedCount',
                      value: (row.testedCount / row?.testCases?.length) * 100,
                      color: '#34C369',
                      tooltip: `Tested (${row.testedCount})`,
                    },
                    row?.notTestedCount && {
                      name: 'notTestedCount',
                      value: (row.notTestedCount / row?.testCases?.length) * 100,
                      color: '#F96E6E',
                      tooltip: `Not Tested (${row.notTestedCount})`,
                    },
                  ]
            }
          />
        </p>
      </div>
    ),
  },
  {
    name: 'Due Date',
    key: 'dueDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.dueDate, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Priority',
    key: 'priority',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <div style={{ cursor: 'pointer' }}>
          {' '}
          <Tags
            droppable
            menu={[
              {
                title: 'Low',
                click: () => {
                  onChangePriority(row?._id, 'Low');
                },
              },
              {
                title: 'Medium',
                click: () => {
                  onChangePriority(row?._id, 'Medium');
                },
              },
              {
                title: 'High',
                click: () => {
                  onChangePriority(row?._id, 'High');
                },
              },
            ]}
            text={row?.priority}
            colorScheme={{
              Low: '#4F4F6E',
              High: '#F96E6E',
              Medium: '#B79C11',
              Critical: '#F80101',
            }}
          />
        </div>
      </div>
    ),
  },
  {
    name: 'Assigned to',
    key: 'assignee.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.assignee?._id,
            rowId: row?._id,
            columnName: 'Assigned to',
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
              user={row?.assignee}
              isHovering={
                isHoveringName?.userId === row?.assignee?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Assigned to'
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
    name: 'Created by',
    key: 'createdBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.createdBy?._id,
            rowId: row?._id,
            columnName: 'Created by',
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
              user={row?.createdBy}
              isHovering={
                isHoveringName?.userId === row?.createdBy?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Created by'
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
    name: 'Created at',
    key: 'createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.createdAt, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {' '}
          <Tags
            text={row.status}
            colorScheme={{
              Open: '#F96E6E',
              Passed: '#34C369',
              Closed: '#34C369',
              Blocked: '#F96E6E',
              'Not Tested': '#8B909A',
              Failed: '#F96E6E',
            }}
          />
        </p>
      </div>
    ),
  },
  {
    name: 'Closed Date',
    key: 'closedDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.closedDate, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Actions',
    key: 'actions',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <Permissions
          allowedRoles={['Admin', 'Project Manager']}
          currentRole={role}
          accessParticular={role === 'QA' && userDetails?.id === row?.createdBy?._id}
        >
          <div className={style.imgDiv1}>
            {row.status !== 'Closed' && (
              <div
                className={style.img}
                onClick={(e) => {
                  e.preventDefault();
                  setAllowResize(!allowResize);
                  setEditRecord(row?._id);
                }}
                data-cy={`testrun-table-editicon${row?.index}`}
              >
                <EditIcon />

                <div className={style.tooltip}>
                  <p>Edit</p>
                </div>
              </div>
            )}

            <div
              className={`${style.img} ${style.imgDel}`}
              onClick={() => setDelModal({ open: true, name: row?.runId, id: row?._id })}
              data-cy={`testrun-table-deleteicon${row?.index}`}
            >
              <DelIcon />
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
