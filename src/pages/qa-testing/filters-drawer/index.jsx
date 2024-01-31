import { useEffect, useState } from 'react';
import SelectBox from 'components/select-box';
import Button from 'components/button';
import CrossIcon from 'components/icon-component/cross';
import DateRange from 'components/date-range';

import style from './filter-drawer.module.scss';
import _ from 'lodash';

const FiltersDrawer = ({
  projectSpecific = '',
  setDrawerOpen,
  control,
  watch,
  setViewBug,
  noHeader,
  searchParams,
  setValue,
  data,
  reset,
  onFilterApply,
}) => {
  const {
    projectOptions = [],
    mileStonesOptions = [],
    featuresOptions = [],
    statusOptions = [],
    severityOptions = [],
    bugTypeOptions = [],
    testTypeOptions = [],
    reportedByOptions = [],
    bugByOptions = [],
    assignedToOptions = [],
    issueTypeOptions = [],
  } = data;

  useEffect(() => {
    projectSpecific && setValue('projects', [projectSpecific]);
  }, [projectSpecific]);

  useEffect(() => {
    if (!watch('milestones') || _.isEmpty(watch('milestones'))) {
      setValue('features', []);
    }
  }, [watch('milestones')]);
  useEffect(() => {
    if (!watch('projects') || _.isEmpty(watch('projects'))) {
      setValue('features', []);
      setValue('milestones', []);
    }
  }, [watch('projects')]);

  const [setSelectedDates] = useState();

  const onChange = (name, dates) => {
    const [start, end] = dates;

    setSelectedDates((pre) => ({ ...pre, [name]: { start, end } }));
    setValue(name, { start, end });
  };

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <span className={style.headerText}>Filters</span>
          <div
            alt=""
            onClick={() => {
              setDrawerOpen(false);
              setViewBug(searchParams ? true : false);
            }}
            className={style.hover1}
          >
            <CrossIcon />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <form className={style.body} style={{ height: noHeader ? '78vh' : '90vh', overflowY: 'auto' }}>
          <div className={style.bottom}>
            <div className={noHeader ? style.gridOne : style.gridTwo}>
              {!noHeader && (
                <div>
                  <SelectBox
                    options={projectOptions}
                    label={'Project'}
                    name={'projects'}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    dynamicClass={style.zDynamicState1}
                    showNumber
                    isMulti
                    placeholder="Select"
                  />
                </div>
              )}
              <div>
                <SelectBox
                  name="milestones"
                  placeholder="Select"
                  control={control}
                  badge
                  options={
                    projectSpecific
                      ? mileStonesOptions.filter((x) => x.projectId === projectSpecific)
                      : mileStonesOptions.filter((x) => watch('projects')?.includes(x.projectId))
                  }
                  label={' Milestone'}
                  isMulti
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState2}
                  showNumber
                  currentValue={watch('status' || [])}
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div>
                <SelectBox
                  options={
                    projectSpecific
                      ? featuresOptions.filter((x) => watch('milestones')?.includes(x.milestoneId))
                      : featuresOptions.filter((x) => watch('milestones')?.includes(x.milestoneId))
                  }
                  label={'Feature'}
                  name={'features'}
                  control={control}
                  placeholder="Select"
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState3}
                  showNumber
                  isMulti
                />
              </div>
              <div>
                <SelectBox
                  options={statusOptions}
                  label={'Status'}
                  name={'status'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState4}
                  showNumber
                  isMulti
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div>
                <SelectBox
                  options={bugTypeOptions}
                  label={'Bug Type'}
                  name={'bugType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState5}
                  showNumber
                  isMulti
                />{' '}
              </div>
              <div>
                <SelectBox
                  options={severityOptions}
                  label={'Severity'}
                  placeholder="Select"
                  name={'severity'}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div className={style.dateDiv}>
                <DateRange
                  handleChange={(e) => onChange('reportedAt', e)}
                  startDate={watch('reportedAt')?.start}
                  endDate={watch('reportedAt')?.end}
                  label="Reported Date"
                  placeholder="Select"
                  name="reportedAt"
                  control={control}
                />
              </div>

              <div className={style.dateDiv}>
                {' '}
                <SelectBox
                  options={reportedByOptions}
                  label={'Reported By'}
                  placeholder="Select"
                  name={'reportedBy'}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div>
                <SelectBox
                  options={bugByOptions}
                  label={'Developer'}
                  name={'bugBy'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                />
              </div>
              <div>
                <SelectBox
                  options={[...assignedToOptions, { checkbox: true, label: 'Unassigned', value: 'Unassigned' }]}
                  label={'Assigned To'}
                  name={'assignedTo'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div>
                <SelectBox
                  options={testTypeOptions}
                  label={'Testing Type'}
                  placeholder="Select"
                  name={'testingType'}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                />
              </div>
              <div>
                <SelectBox
                  options={issueTypeOptions}
                  label={'Issue Type'}
                  name={'issueType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState6}
                  showNumber
                  isMulti
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div className={style.dateDiv}>
                <DateRange
                  handleChange={(e) => onChange('reTestDate', e)}
                  startDate={watch('reTestDate')?.start}
                  endDate={watch('reTestDate')?.end}
                  label="Retest Date"
                  placeholder="Select"
                  name="reTestDate"
                  control={control}
                />
              </div>
              <div className={style.dateDiv}>
                <DateRange
                  handleChange={(e) => onChange('closedDate', e)}
                  startDate={watch('closedDate')?.start}
                  endDate={watch('closedDate')?.end}
                  label="Closed Date"
                  placeholder="Select"
                  name="closedDate"
                  control={control}
                />
              </div>
            </div>

            <div className={style.resetDiv} style={{ marginTop: '10px' }}>
              <Button
                text={'Reset'}
                type="button"
                btnClass={style.reset}
                style={{ marginRight: '10px', marginLeft: '10px' }}
                onClick={(e) => {
                  e.preventDefault();
                  reset();
                }}
              />
              <Button
                text={'Apply'}
                type="button"
                btnClass={style.applyClass}
                onClick={(e) => {
                  e.preventDefault();
                  onFilterApply();
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FiltersDrawer;
