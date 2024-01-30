import { useState, useMemo, useEffect, useReducer, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import Loader from 'components/loader';
import Button from 'components/button';
import PropTypes from 'prop-types';

import Checkbox from 'components/checkbox';
import GenericTable from 'components/generic-table/virtulized-generic-table';
import CrossIcon from 'components/icon-component/cross';
import ArrowUp from 'components/icon-component/arrow-up';
import Warning from 'components/icon-component/warning';
import FormCloseModal from 'components/form-close-modal';
import {
  columnsData,
  initialFilter,
  testCaseSelectionHandler,
  checkedHandler,
  initialValueFilters,
  resetHandler,
  onExpand,
  unClickedAll,
  filteredTestCasesHandler,
  updateCountHandler,
} from './helper';
import { values as _values, debounce as _debounce } from 'utils/lodash';

import { useGetTestCasesByFilter } from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useToaster } from 'hooks/use-toaster';

import search from 'assets/search.svg';
import clearIcon from 'assets/cross.svg';

import style from './modal.module.scss';

const SelectTestCases = ({ openAddModal, setOpenAddModal, projectId, onSubmit, editRecords, options }) => {
  const { control, setValue, watch } = useForm();

  const { toastError } = useToaster();

  const [viewSelected, setViewSelected] = useState(false);
  const [filters, setFilters] = useState(initialFilter);
  const { projectOptions = [], featuresOptions = [], mileStonesOptions = [] } = options;

  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);

  const initializeTestCase = useCallback(({ state, data }) => {
    const newTestCases = {
      ...state,
      totalCount: data.count,
      filteredTestCases: data.testcases || [],
      allTestCases: data.testcases.reduce((accumulator, x) => {
        accumulator[x._id] = {
          checked: false,
          milestoneId: x.milestoneId._id,
          featureId: x.featureId._id,
          item: x,
        };
        return accumulator;
      }, {}),
    };

    let dataState = updateCountHandler({
      state: newTestCases,
      data: { ...data, subType: 'initialCount' },
    });

    if (editRecords?.length > 0) {
      setViewSelected(true);
      dataState = testCaseSelectionHandler({
        state: dataState,
        data: { testCases: editRecords, event: { target: { checked: true } } },
      });
    }

    return dataState;
  }, []);

  const filteredMilestoneOptions = useCallback(
    ({ state }) => {
      const milestones = mileStonesOptions?.filter((x) => x.projectId === watch('projectId')) || [];

      const milestoneTree = milestones.reduce((accumulator, milestone) => {
        const milestoneId = milestone._id;

        accumulator[milestoneId] = {
          onClicked: (e, id) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch({ type: 'clicked', data: { milestoneId: id, type: 'milestone' } });
          },
          onExpand: (id) => {
            dispatch({ type: 'milestoneExpand', data: id });
          },
          onChecked: (e) => {
            dispatch({ type: 'checkedHandler', data: { id: milestoneId, type: 'milestone', e } });
          },
          totalCount: 0,
          selectedCount: 0,

          checked: false,
          expanded: false,
          partial: false,
          clicked: false,
          _id: milestone._id,
          label: milestone.label,
        };

        accumulator[milestoneId].mileStonesFeaturesOptions = featuresOptions
          ?.filter((feature) => feature.milestoneId === milestone._id)
          .reduce((featureAccumulator, feature) => {
            const featureId = feature._id;

            featureAccumulator[featureId] = {
              _id: feature._id,
              label: feature.label,
              checked: false,
              clicked: false,
              partial: false,
              totalCount: 0,
              selectedCount: 0,
              onClicked: (e, id, featureId) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch({
                  type: 'clicked',
                  data: { milestoneId: id, featureId, type: 'feature' },
                });
              },
              onChecked: (e) => {
                dispatch({ type: 'checkedHandler', data: { id: featureId, type: 'feature', e } });
              },
            };

            return featureAccumulator;
          }, {});

        return accumulator;
      }, {});

      return {
        ...state,
        milestoneOptions: milestoneTree,
        selection: { project: projectOptions.find((x) => x.value === watch('projectId')).label },
      };
    },
    [watch('projectId'), projectOptions],
  );

  const onClicked = useCallback(({ state, data }) => {
    unClickedAll({ state, data });
    if (data.type === 'milestone') {
      state.milestoneOptions[data.milestoneId].expanded = true;
      state.milestoneOptions[data.milestoneId].clicked = true;
      state.selection = {
        ...state.selection,
        mileStone: state.milestoneOptions[data.milestoneId].label,
        feature: null,
      };

      setFilters((pre) => ({ ...pre, milestones: [data.milestoneId], features: [] }));
    } else if (data.type === 'feature') {
      state.milestoneOptions[data.milestoneId].mileStonesFeaturesOptions[data.featureId].clicked = true;
      state.selection = {
        ...state.selection,
        mileStone: state.milestoneOptions[data.milestoneId].label,
        feature: state.milestoneOptions[data.milestoneId].mileStonesFeaturesOptions[data.featureId].label,
      };

      setFilters((pre) => ({
        ...pre,
        milestones: [data.milestoneId],
        features: [data.featureId],
      }));
    }

    return { ...state };
  }, []);

  const testCaseReducer = (state, action) => {
    switch (action.type) {
      case 'initializeTestCase':
        return initializeTestCase({ state, data: action.data });
      case 'milestoneOptions':
        return filteredMilestoneOptions({ state });
      case 'milestoneExpand':
        return onExpand({ state, data: { id: action.data, type: 'milestone' } });
      case 'clicked':
        return onClicked({ state, data: { ...action.data } });
      case 'filteredTestCases':
        return filteredTestCasesHandler({ state, data: { ...action.data } });
      case 'resetHandler':
        return resetHandler({ state, data: { ...action.data } });
      case 'testCaseCheckHandler':
        return testCaseSelectionHandler({ state, data: { ...action.data } });
      case 'checkedHandler':
        return checkedHandler({ state, data: { ...action.data } });

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(testCaseReducer, initialValueFilters);

  // NOTE: fetching TextCases
  const { mutateAsync: _getAllTestCases, isLoading } = useGetTestCasesByFilter();
  const fetchTestCases = async (filters) => {
    try {
      const response = await _getAllTestCases(filters);
      if (_values(state.allTestCases).length) {
        dispatch({ type: 'filteredTestCases', data: response });
      } else {
        dispatch({ type: 'initializeTestCase', data: response });
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (watch('projectId')) {
      fetchTestCases(filters);
    }
  }, [filters]);

  useEffect(() => {
    dispatch({ type: 'resetHandler' });
    if (watch('projectId')) {
      dispatch({ type: 'milestoneOptions' });
      setFilters((pre) => ({ ...pre, projects: [watch('projectId')] }));
    }
  }, [watch('projectId')]);

  useEffect(() => {
    if (projectId) {
      setValue('projectId', projectId);
    }
  }, [projectId]);

  const columnsCalculatedData = useMemo(() => {
    const data = columnsData({
      allPartialChecked: state.isFilteredTestCasesArePartialChecked && !state.isFilteredTestCasesAreChecked,
      allChecked: state.isFilteredTestCasesArePartialChecked || state.isFilteredTestCasesAreChecked,
      allTestCases: state.allTestCases,
      allFilteredTestCases: state.filteredTestCases,
      testCaseChecked: (e, testCases) => {
        dispatch({ type: 'testCaseCheckHandler', data: { testCases, event: e } });
      },
    });
    return data;
  }, [state]);

  const closeForm = () => {
    setOpenAddModal(false);
    setValue('projectId', '');
    setOpenFormCloseModal(false);
  };

  const handleDiscard = () => {
    _values(state.selectedTestCases).length ? setOpenFormCloseModal(true) : closeForm();
  };

  return (
    <div>
      <Modal open={!!openAddModal} handleClose={handleDiscard} className={style.mainDiv}>
        {openFormCloseModal && (
          <FormCloseModal
            modelOpen={openFormCloseModal}
            setModelOpen={setOpenFormCloseModal}
            confirmBtnHandler={closeForm}
            heading={`You have unsaved changes`}
            subHeading={` Are you sure you want to exit? Your unsaved changes will be discarded.`}
            confirmBtnText={`Discard Changes`}
            icon={<Warning />}
            cancelBtnText={`Back To Form`}
          />
        )}
        <div className={style.crossImg}>
          <span className={style.modalTitle}>Select Test Cases</span>
          <div alt="" onClick={handleDiscard} className={style.hover}>
            <CrossIcon />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <div className={style.inner}>
          <div className={style.left}>
            <div className={style.search}>
              <TextField
                searchField={true}
                icon={search}
                clearIcon={clearIcon}
                placeholder={'Search...'}
                onClear={_debounce(() => {
                  setFilters((pre) => ({ ...pre, search: '' }));
                }, 1000)}
                onChange={_debounce((e) => {
                  setFilters((pre) => ({ ...pre, search: e.target.value }));
                }, 1000)}
                data-cy="testrun-testcasemodal-searchbar"
              />
            </div>

            <SelectBox
              control={control}
              label={'Project'}
              name={'projectId'}
              disabled={!!projectId}
              options={projectOptions}
              id="testrun-testcasemodal-project"
            />
            <div className={style.filterClass}>
              <p
                className={style.view}
                // NOTE: #todo:  what should happen to select ALL
                onClick={() => setViewSelected((pre) => !pre)}
                data-cy="viewalltestcases-testrun-btn"
              >
                View All
                {!viewSelected ? ` Selected Test Cases(${state.selectionCount})` : ' Test Cases'}
              </p>

              <div className={style.milestoneOptions}>
                {_values(state?.milestoneOptions)?.map((mileStoneEle, index) => {
                  return (
                    <div key={index}>
                      <div className={style.filterFlex}>
                        <div className={style.filterInner}>
                          <div
                            onClick={() => mileStoneEle.onExpand(mileStoneEle._id)}
                            style={{
                              cursor: 'pointer',
                              transform: mileStoneEle.expanded ? 'rotate(180deg)' : 'rotate(90deg)',
                            }}
                          >
                            <ArrowUp />
                          </div>
                          <div
                            style={{
                              width: '100%',
                              borderRadius: '3px',

                              ...(mileStoneEle.clicked && {
                                padding: '5px 0px',
                                border: '1px solid #11103D',
                                backgroundColor: '#F3F3F3',
                              }),
                            }}
                          >
                            <div className={style.filterInner2}>
                              <Checkbox
                                name="checkbox"
                                checked={state.milestoneOptions[mileStoneEle._id].checked}
                                partial={state.milestoneOptions[mileStoneEle._id].partial}
                                handleChange={state.milestoneOptions[mileStoneEle._id].onChecked}
                                data-cy={`testrun-testcasemodal-milestone-checkbox${index}`}
                              />
                              <span
                                style={{
                                  cursor: 'pointer',
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                                onClick={(e) => mileStoneEle.onClicked(e, mileStoneEle._id)}
                              >
                                <span style={{ wordBreak: 'break-all' }}>{mileStoneEle.label}</span>
                                <span className={style.recordCount}>
                                  ({mileStoneEle.selectedCount}/{mileStoneEle.totalCount})
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {mileStoneEle.expanded &&
                        _values(mileStoneEle.mileStonesFeaturesOptions)?.map((featureEle, ind) => (
                          <div
                            key={ind}
                            className={style.filterFlex}
                            style={{
                              marginLeft: '19px',

                              borderRadius: '3px',
                              ...(featureEle.clicked && {
                                padding: '5px 0px',
                                border: '1px solid #11103D',
                                backgroundColor: '#F3F3F3',
                              }),
                            }}
                          >
                            <div className={style.filterInnerChild} style={{}}>
                              <Checkbox
                                name="checkboxChild"
                                checked={
                                  state.milestoneOptions[mileStoneEle._id].mileStonesFeaturesOptions[featureEle._id]
                                    .checked
                                }
                                partial={
                                  state.milestoneOptions[mileStoneEle._id].mileStonesFeaturesOptions[featureEle._id]
                                    .partial
                                }
                                handleChange={
                                  state.milestoneOptions[mileStoneEle._id].mileStonesFeaturesOptions[featureEle._id]
                                    .onChecked
                                }
                                data-cy={`testrun-testcasemodal-milestone-checkboxchild${index}`}
                              />
                              <span
                                style={{
                                  cursor: 'pointer',
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                                onClick={(e) => featureEle.onClicked(e, mileStoneEle._id, featureEle._id)}
                              >
                                <span style={{ wordBreak: 'break-all' }}>{featureEle.label}</span>
                                <span className={style.recordCount}>
                                  ({featureEle.selectedCount}/{featureEle.totalCount})
                                </span>
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={style.right}>
            <div className={style.path}>
              {viewSelected
                ? `Selected Test Cases`
                : `${state.selection.project || ''} ${
                    state.selection.mileStone ? ` > ${state.selection.mileStone}` : ''
                  } ${state.selection.feature ? ` > ${state.selection.feature}` : ''} ${
                    state.selection.project ? `(${state.totalCount})` : ''
                  }`}
            </div>
            <div className={style.tableWidth}>
              {isLoading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 290px)',
                  }}
                >
                  <Loader />
                </div>
              ) : (
                <GenericTable
                  columns={columnsCalculatedData}
                  dataSource={viewSelected ? _values(state.selectedTestCases) || [] : state.filteredTestCases || []}
                  height={'600px'}
                  paddingTop={'30px'}
                  width={'2000px'}
                  classes={{
                    test: style.test,
                    table: style.table,
                    thead: style.thead,
                    th: style.th,
                    containerClass: style.checkboxContainer,
                    tableBody: style.tableRow,
                  }}
                />
              )}
            </div>
            <div className={style.btns}>
              <Button
                text={'Discard'}
                type={'button'}
                btnClass={style.btn}
                handleClick={() => {
                  handleDiscard();
                }}
                data-cy="testrun-testcasemodal-discard-btn"
              />
              <Button
                text={`Select (${state.selectionCount})`}
                handleClick={() => {
                  onSubmit(_values(state.selectedTestCases), watch('projectId'));
                  setOpenAddModal(false);
                }}
                disabled={!state.selectionCount ? true : false}
                data-cy="testrun-testcasemodal-save-btn"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
SelectTestCases.propTypes = {
  openAddModal: PropTypes.func.isRequired,
  setOpenAddModal: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editRecords: PropTypes.array.isRequired,
  options: PropTypes.shape({
    projectOptions: PropTypes.array.isRequired,
    featuresOptions: PropTypes.array.isRequired,
    mileStonesOptions: PropTypes.array.isRequired,
  }).isRequired,
};
export default SelectTestCases;
