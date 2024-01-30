import style from './modal.module.scss';
import Checkbox from 'components/checkbox';
import { formattedDate } from 'utils/date-handler';
import Tags from 'components/tags';
import { values as _values } from 'utils/lodash';
import { useQuery } from 'react-query';
import { getAllProjectsMilestonesFeatures } from 'api/v1/projects/projects';

export const initialFilter = {
  search: '',
  projects: [],
  milestones: [],
  features: [],
  status: [],
  createdBy: [],
  lastTestedBy: [],
  state: [],
  weightage: [],
  testType: [],

  relatedTicketId: '',
};

export function useProjectOptions() {
  return useQuery({
    queryKey: ['projectsOptions'],
    queryFn: async () => {
      const _getProjectsMilestonesFeatures = await getAllProjectsMilestonesFeatures();

      const projectOptions =
        _getProjectsMilestonesFeatures?.allProjects?.map((x) => ({
          label: x.name,
          value: x._id,
        })) || [];

      const mileStonesOptions =
        _getProjectsMilestonesFeatures?.allMilestones?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
        })) || [];

      const featuresOptions =
        _getProjectsMilestonesFeatures?.allFeatures?.map((x) => ({
          ...x,
          label: x.name,
          value: x._id,
        })) || [];

      return {
        projectOptions,
        mileStonesOptions,
        featuresOptions,
      };
    },
    refetchOnWindowFocus: false,
  });
}

export const columnsData = ({ allPartialChecked, allChecked, allTestCases, allFilteredTestCases, testCaseChecked }) => [
  {
    name: (
      <Checkbox
        checked={allChecked}
        partial={allPartialChecked}
        handleChange={(e) => {
          testCaseChecked(e, allFilteredTestCases);
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
        <div className={style.imgDiv}>
          <Checkbox
            checked={allTestCases[row?._id].checked}
            name={row?._id}
            handleChange={(e) => testCaseChecked(e, [row])}
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
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '250px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div
          className={style.imgDiv}
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
    name: 'Project',
    key: 'projectId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName}>{row?.projectId?.name}</p>
        </div>
      );
    },
  },
  {
    name: 'Milestone',
    key: 'milestoneId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
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
    key: 'featureId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
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
    widthAndHeight: { width: '250px', height: '36px' },
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
    key: 'testObjective',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
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
    key: 'preConditions',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
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
    key: 'testSteps',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
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
    key: 'expectedResults',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
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
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row.weightage}</p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'status',
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
          <Tags text={row.status} />
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
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row.relatedTicketId}</p>
      </div>
    ),
  },

  {
    name: 'Last Tested at',
    key: 'lastTestedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row.lastTestedAt, 'dd-MMM-yy')}</p>
      </div>
    ),
  },
  {
    name: 'Last Tested by',
    key: 'lastTestedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
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
    widthAndHeight: { width: '250px', height: '36px' },
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
    name: 'Created by',
    key: 'createdBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.createdBy?.name}</p>
      </div>
    ),
  },
];

export const initialValueFilters = {
  filteredTestCases: [],
  allTestCases: {},
  milestoneOptions: {},
  totalCount: 0,
  selection: {},
  selectedTestCases: {},
  selectionCount: 0,
  isFilteredTestCasesArePartialChecked: false,
  isFilteredTestCasesAreChecked: false,
};

export const testCaseSelectionHandler = ({ state, data }) => {
  const { event, testCases } = data;

  const selection = testCases;
  const newState = { ...state };
  // NOTE: checking true all the values for testCases Getting
  for (const item of selection) {
    newState.allTestCases[item._id].checked = event.target.checked;
    if (event.target.checked) {
      newState.selectedTestCases[item._id] = item;
      state.milestoneOptions[item.milestoneId._id].selectedCount >= 0
        ? (state.milestoneOptions[item.milestoneId._id].selectedCount += 1)
        : null;
      state.milestoneOptions[item.milestoneId._id].selectedCount >= 0
        ? (state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[
            item.featureId._id
          ].selectedCount += 1)
        : '';
    } else if (!event.target.checked) {
      delete state.selectedTestCases[item._id];
      state.milestoneOptions[item.milestoneId._id].selectedCount
        ? (state.milestoneOptions[item.milestoneId._id].selectedCount -= 1)
        : '';
      state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount
        ? (state.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[
            item.featureId._id
          ].selectedCount -= 1)
        : '';
    }
    // NOTE: setting MileStone Partial or checked
    newState.milestoneOptions[item.milestoneId._id].checked =
      !!newState.milestoneOptions[item.milestoneId._id].selectedCount;
    newState.milestoneOptions[item.milestoneId._id].partial =
      !!newState.milestoneOptions[item.milestoneId._id].selectedCount &&
      newState.milestoneOptions[item.milestoneId._id].totalCount !==
        newState.milestoneOptions[item.milestoneId._id].selectedCount;

    // NOTE: setting feature Partial or checked
    newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].checked =
      !!newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount;
    newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].partial =
      !!newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount &&
      newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].totalCount !==
        newState.milestoneOptions[item.milestoneId._id].mileStonesFeaturesOptions[item.featureId._id].selectedCount;
  }

  // NOTE: setting filtered testCases Partial or Checked
  newState.isFilteredTestCasesArePartialChecked = newState.filteredTestCases.some(
    (x) => newState.allTestCases[x._id].checked === true,
  );
  newState.isFilteredTestCasesAreChecked = newState.filteredTestCases.every(
    (x) => newState.allTestCases[x._id].checked === true,
  );
  newState.selectionCount = _values(state.selectedTestCases).length;

  return { ...newState };
};

export const checkedHandler = ({ state, data }) => {
  const { e, type, id } = data;
  const testCases = _values(state.allTestCases).reduce((accumulator, testcase) => {
    const condition = type === 'milestone' ? testcase.milestoneId === id : testcase.featureId === id;
    if (condition) {
      accumulator.push(testcase.item);
    }

    return accumulator;
  }, []);
  const newState = testCaseSelectionHandler({ state, data: { event: e, testCases } });
  return { ...newState };
};

export const resetHandler = () => {
  return initialValueFilters;
};

export const onExpand = ({ state, data }) => {
  if (data.type === 'milestone') {
    state.milestoneOptions[data.id].expanded = !state.milestoneOptions[data.id].expanded;
    return { ...state };
  } else {
    return { ...state };
  }
};

export const unClickedAll = ({ state, data }) => {
  Object.keys(state.milestoneOptions).forEach((milestoneId) => {
    if (milestoneId !== data.id) {
      state.milestoneOptions[milestoneId].clicked = false;
    }
  });
  Object.keys(state.milestoneOptions).forEach((milestoneId) => {
    if (milestoneId !== data.id) {
      Object.keys(state.milestoneOptions[milestoneId].mileStonesFeaturesOptions).forEach((featureId) => {
        state.milestoneOptions[milestoneId].mileStonesFeaturesOptions[featureId].clicked = false;
      });
    }
  });
  return state;
};

export const filteredTestCasesHandler = ({ state, data }) => {
  const newState = {
    ...state,
    totalCount: data.count,
    filteredTestCases: data.testcases || [],
  };
  return { ...newState };
};

export const updateCountHandler = ({ state, data }) => {
  if (data.subType === 'initialCount') {
    const newState = {
      ...state,
      mileStonesOptions: data.testcases.reduce(
        (acc, testcase) => {
          const milestoneId = testcase.milestoneId._id;
          const featureId = testcase.featureId._id;
          if (acc[milestoneId]) {
            acc[milestoneId].totalCount += 1;

            if (acc[milestoneId].mileStonesFeaturesOptions[featureId]) {
              acc[milestoneId].mileStonesFeaturesOptions[featureId].totalCount += 1;
            }
          }
          return acc;
        },
        { ...state.milestoneOptions },
      ),
    };

    return newState;
  } else {
    return state;
  }
};
