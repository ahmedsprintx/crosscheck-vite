import React, { useState } from 'react';

import { useAppContext } from 'context/app.context';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import CrossIcon from 'components/icon-component/cross';
import DateRange from 'components/date-range';
import Permissions from 'components/permissions';

import { useActivityOptions } from './helper';

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
  const { data = {} } = useActivityOptions();
  const { activityBy = [], activityType = [] } = data;
  const [selectedDates, setSelectedDates] = useState();

  const { userDetails } = useAppContext();

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
          <div>
            <div className={style.statusBar}>
              <Permissions allowedRoles={['Admin']} currentRole={userDetails.role}>
                <SelectBox
                  options={activityBy}
                  name="activityBy"
                  control={control}
                  badge
                  isMulti
                  label={'Activity By'}
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState5}
                  showNumber
                />
              </Permissions>
              <SelectBox
                label={'Type'}
                options={activityType}
                name={'activityType'}
                control={control}
                isMulti
                numberBadgeColor={'#39695b'}
                placeholder={'Select'}
                dynamicClass={style.zDynamicState5}
                showNumber
              />
            </div>
            <div className={style.statusBar}>
              <div className={style.dateSingle}>
                <DateRange
                  handleChange={(e) => onChange('activityAt', e)}
                  startDate={watch('activityAt')?.start}
                  endDate={watch('activityAt')?.end}
                  label={'Activity Date'}
                  placeholder={'Select'}
                  name={'activityAt'}
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
