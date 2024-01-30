import _ from 'lodash';

import style from './test.module.scss';
import Tags from 'components/tags';
import Checkbox from 'components/checkbox';
import { useQuery } from 'react-query';
import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';
import { getUsers } from 'api/v1/settings/user-management';
import { formattedDate } from 'utils/date-handler';
import Permissions from 'components/permissions';
import EditIcon from 'components/icon-component/edit-icon';
import DelIcon from 'components/icon-component/del-icon';
import UserName from 'components/user-name';
import Highlighter from 'components/highlighter';
import CreateTask from 'components/icon-component/create-task';
import TestRunIcon from 'components/icon-component/test-run';
import ChangeStatus from 'components/icon-component/change-status';

export const initialFilter = {
  search: '',
  projects: [],
  milestones: [],
  features: [],
  status: [],
  createdBy: [],
  state: [],
  lastTestedBy: [],
  weightage: [],
  testType: [],
  page: 1,
  perPage: 25,
  createdAt: {
    start: null,
    end: null,
  },

  lastTestedAt: {
    start: null,
    end: null,
  },
  relatedTicketId: '',
};

export function useProjectOptions() {
  return useQuery({
    queryKey: ['projectsOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();

      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x, i) => ({
          index: i,
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
        { label: 'Not Tested', value: 'Not Tested', checkbox: true },
        { label: 'Blocked', value: 'Blocked', checkbox: true },
        { label: 'Failed', value: 'Failed', checkbox: true },
        { label: 'Passed', value: 'Passed', checkbox: true },
      ];

      const weighageOptions = [
        { label: 1, value: 1, checkbox: true },
        { label: 2, value: 2, checkbox: true },
        { label: 3, value: 3, checkbox: true },
        { label: 4, value: 4, checkbox: true },
        { label: 5, value: 5, checkbox: true },
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
          label: 'Functionality Testing',
          value: 'Functionality',
          checkbox: true,
        },
        { label: 'Performance Testing', value: 'Performance', checkbox: true },
        { label: 'Security Testing', value: 'Security', checkbox: true },
        { label: 'UI Testing', value: 'UI', checkbox: true },
      ];

      const testingTypeOptions = [
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
        projectOptions,
        severityOptions,
        bugTypeOptions,
        mileStonesOptions,
        priorityOptions,
        featuresOptions,
        statusOptions,
        weighageOptions,
        testTypeOptions,
        testingTypeOptions,
        assignedToOptions: users
          .filter((x) => x.role === 'Developer')
          .map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
        createdByOptions: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
        lastTestedBy: users.map((x) => ({
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
  testCases,
  setSearchParams,
  setSelectedRecords,
  selectedRecords,
  setDelModal,
  setViewTestCase,
  searchedText,
  setEditRecord,
  setSelectedRunRecords,
  isHoveringName,
  setIsHoveringName,
  setSelectedBugs,
  role,
  noHeader,
}) => [
  {
    name: (
      <Checkbox
        checked={testCases?.some((testCase) => selectedRecords.includes(testCase?._id))}
        partial={
          testCases?.some((testCase) => selectedRecords.includes(testCase?._id)) &&
          testCases?.length !== selectedRecords?.length
        }
        handleChange={(e) => {
          setSelectedRecords(() => (e.target.checked ? testCases.map((x) => x._id) : []));
          setSelectedBugs(() => (e.target.checked ? testCases?.map((x) => x) : []));
          setSelectedRunRecords(() => (e.target.checked ? testCases?.map((x) => x) : []));
        }}
      />
    ),
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '50px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv} style={{ minWidth: '50px' }}>
          <Checkbox
            checked={selectedRecords.includes(row._id)}
            name={row?._id}
            handleChange={(e) => {
              setSelectedRecords((pre) =>
                pre.includes(row._id) ? pre.filter((x) => x !== row._id) : [...pre, row._id],
              );
              if (e.target.checked) {
                setSelectedBugs((prev) => [...prev, row]);
                setSelectedRunRecords((prev) => [...prev, row]);
              } else {
                setSelectedBugs((prev) => prev.filter((selectedBug) => selectedBug?._id !== row?._id));
                setSelectedRunRecords((prev) => prev.filter((selectedBug) => selectedBug?._id !== row?._id));
              }
            }}
          />
        </div>
      );
    },
  },
  {
    name: 'Test Case ID',
    key: 'testCaseId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
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
              testCaseId: row?.testCaseId,
            });
          }}
          data-cy={`testcase-table-id${row?.index}`}
        >
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.testCaseId}</Highlighter>
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
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.projectId?.name}</Highlighter>
          </p>
        </div>
      );
    },
  },
  {
    name: 'Milestone',
    key: 'milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

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
    widthAndHeight: { width: '120px', height: '36px' },
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
    name: 'Test Type',
    key: 'testType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Objective',
    key: 'testObjective.text',
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
          <Highlighter search={searchedText}>{row?.testObjective?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Pre Conditions',
    key: 'preConditions.text',
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
          <Highlighter search={searchedText}>{row?.preConditions?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Steps',
    key: 'testSteps.text',
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
          <Highlighter search={searchedText}>{row?.testSteps?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Expected Results',
    key: 'expectedResults.text',
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
          <Highlighter search={searchedText}>{row?.expectedResults?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Weightage',
    key: 'weightage',
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
          <Highlighter search={searchedText}>{row?.weightage}</Highlighter>
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
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Tags text={row.status} />
        </p>
      </div>
    ),
  },
  {
    name: 'State',
    key: 'state',
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
          <Highlighter search={searchedText}>{row?.state}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Related Ticket ID',
    key: 'relatedTicketId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.relatedTicketId}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Last Tested at',
    key: 'lastTestedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.lastTestedAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Last Tested by',
    key: 'lastTestedBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.lastTestedBy?._id,
            rowId: row?._id,
            columnName: 'Last Tested by',
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
              user={row?.lastTestedBy}
              isHovering={
                isHoveringName?.userId === row?.lastTestedBy?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Last Tested by'
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
    widthAndHeight: { width: '115px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.createdAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Created by',
    key: 'createdBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
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
        <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={role}>
          <div className={style.imgDiv1}>
            <div
              className={style.img}
              onClick={(e) => {
                e.preventDefault();
                setViewTestCase(true);
                setEditRecord(row?._id);
              }}
              data-cy={`addtestcasepage-edit-icon${row?.index}`}
            >
              <div>
                <EditIcon />
              </div>
              <div className={style.tooltip}>
                <p>Edit</p>
              </div>
            </div>
            <div
              className={style.img}
              onClick={() => setDelModal({ open: true, name: row?.testCaseId, id: row?._id })}
              data-cy={`addtestcasepage-del${row?.index}`}
            >
              <div className={style.deleteIcon}>
                <DelIcon />
              </div>
              <div className={style.tooltip}>
                <p>Delete </p>
              </div>
            </div>
          </div>
        </Permissions>
      </>
    ),
  },
];

export const rows = [];

export const menuData = ({ moreMenu, setMoreMenu }) => [
  {
    border: '1px solid #D6D6D6',
    bodyData: [
      {
        icon: <EditIcon backClass={style.editColor} />,
        text: 'Edit',
      },
      {
        moreClick: () => setMoreMenu(true),
        moreMenu: { moreMenu },
        setMoreMenu: { setMoreMenu },
        icon: <ChangeStatus backClass={style.editColor} />,
        text: 'Change Status',
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
    ],
  },

  {
    bodyData: [
      {
        icon: (
          <div className={style.editColor1}>
            <DelIcon />
          </div>
        ),
        text: 'Delete',
      },
    ],
  },
];
