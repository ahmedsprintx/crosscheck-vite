import dotIcon from 'assets/Drag.svg';

import style from './add.module.scss';
import Tags from 'components/tags';
import Checkbox from 'components/checkbox';
import { formattedDate } from 'utils/date-handler';
import EditIcon from 'components/icon-component/edit-icon';
import DelIcon from 'components/icon-component/del-icon';

export const columnsData = ({
  testCases,
  setDelModal,
  setViewTestCase,
  setSelectedRecords,
  selectedRecords,
  setEditRecord,
  setAllowResize,
  setViewTestCaseId,
  setSelectedRunRecords,
}) => [
  {
    name: '',
    key: 'actions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '50px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ provided }) => {
      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            {...provided.dragHandleProps}
          >
            <img src={dotIcon} alt="" />
          </p>
        </div>
      );
    },
  },

  {
    name: (
      <Checkbox
        checked={testCases?.some((testCase) => selectedRecords.includes(testCase._id))}
        partial={
          testCases?.some((testCase) => selectedRecords.includes(testCase._id)) &&
          testCases?.length !== selectedRecords?.length
        }
        handleChange={(e) => {
          setSelectedRecords(() => (e.target.checked ? testCases.map((x) => x._id) : []));
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
        <div
          className={style.imgDiv}
          style={{
            paddingLeft: '8px',
          }}
        >
          <Checkbox
            checked={selectedRecords.includes(row._id)}
            name={row?._id}
            handleChange={(e) => {
              setSelectedRecords((pre) =>
                pre.includes(row._id) ? pre.filter((x) => x !== row._id) : [...pre, row._id],
              );
              if (e.target.checked) {
                setSelectedRunRecords((prev) => [...prev, row]);
              } else {
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
          onClick={() => {
            setViewTestCaseId(row?._id);
            setViewTestCase(true);
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          <p className={style.userName}>{row?.testCaseId}</p>
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
    widthAndHeight: { width: '90px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.milestoneId?.name}</p>
      </div>
    ),
  },

  {
    name: 'Feature',
    key: 'featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.featureId?.name}</p>
      </div>
    ),
  },
  {
    name: 'Test Type',
    key: 'testType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testType}</p>
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
        <p className={style.userName}>{row?.testObjective?.text}</p>
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
        <p className={style.userName}>{row?.preConditions?.text}</p>
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
        <p className={style.userName}>{row?.testSteps?.text}</p>
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
        <p className={style.userName}>{row?.expectedResults?.text}</p>
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
        <p className={style.userName}>{row?.weightage}</p>
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
          <Tags text={row?.status} color="#F96E6E" />
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
        <p className={style.userName}>{row?.relatedTicketId}</p>
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
        <p className={style.userName}>{formattedDate(row?.lastTestedAt, 'dd MMM,yyyy')}</p>
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

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.lastTestedBy?.name}</p>
      </div>
    ),
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
        <p className={style.userName}>{formattedDate(row?.createdAt, 'dd MMM,yyyy')}</p>
      </div>
    ),
  },
  {
    name: 'Created by',
    key: 'createdB.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.createdBy?.name}</p>
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
        <div className={style.imgDiv1}>
          <div
            className={style.img}
            onClick={(e) => {
              e.preventDefault();
              setAllowResize(true);
              setEditRecord(row._id);
            }}
          >
            <EditIcon />
            <div className={style.tooltip}>
              <p>Edit</p>
            </div>
          </div>
          <div className={style.img} onClick={() => setDelModal({ open: true, name: row?.testCaseId, id: row?._id })}>
            <DelIcon />
            <div className={style.tooltip}>
              <p>Delete</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
];
