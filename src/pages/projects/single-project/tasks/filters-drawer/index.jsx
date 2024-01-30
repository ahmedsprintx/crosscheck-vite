import React, { useState } from 'react';
import { useProjectOptions } from './helper';
import SelectBox from 'components/select-box';
import Button from 'components/button';
import CrossIcon from 'components/icon-component/cross';
import DateRange from 'components/date-range';

import style from './filter-drawer.module.scss';

const FiltersDrawer = ({
  setDrawerOpen,
  control,
  watch,
  noHeader,
  setValue,
  reset,
  onFilterApply,
}) => {
  const { data = {} } = useProjectOptions();

  const {
    applicationOptions = [],
    createdByOptions = [],
    taskTypeOptions = [],
    assignedTo = [],
  } = data;
  const [selectedDates, setSelectedDates] = useState();

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
            }}
            className={style.hover1}
          >
            <CrossIcon />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <div className={style.body} style={{ height: noHeader && '78%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className={style.statusBar}>
              <SelectBox
                options={applicationOptions}
                label={'Application'}
                name={'applicationType'}
                control={control}
                numberBadgeColor={'#39695b'}
                placeholder={'Select'}
                dynamicClass={style.zDynamicState45}
                showNumber
                isMulti
              />
              <SelectBox
                options={taskTypeOptions}
                label={'Tast Type'}
                placeholder={'Select'}
                name={'taskType'}
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />
            </div>
            <div className={style.statusBar}>
              <SelectBox
                options={assignedTo}
                label={'Assignee'}
                placeholder={'Select'}
                name={'crossCheckAssignee'}
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />{' '}
              <SelectBox
                options={createdByOptions}
                label={'Created By'}
                placeholder={'Select'}
                name={'createdBy'}
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />
            </div>{' '}
            <div className={style.statusBar}>
              <div className={style.dateSingle}>
                <DateRange
                  handleChange={(e) => onChange('createdAt', e)}
                  startDate={watch('createdAt')?.start}
                  endDate={watch('createdAt')?.end}
                  label={'Created Date'}
                  name={'createdAt'}
                  placeholder={'Select'}
                  control={control}
                />
              </div>
            </div>
          </div>
          <div className={style.resetDiv}>
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
      </div>
    </>
  );
};

export default FiltersDrawer;
