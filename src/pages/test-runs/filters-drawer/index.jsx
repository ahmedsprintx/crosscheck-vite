import { useState } from 'react';
import { useProjectOptions } from '../helper';
import SelectBox from 'components/select-box';
import Button from 'components/button';
import CrossIcon from 'components/icon-component/cross';
import DateRange from 'components/date-range';
import PropTypes from 'prop-types';

import style from './filter-drawer.module.scss';

const FiltersDrawer = ({ setDrawerOpen, control, watch, noHeader, setValue, reset, onFilterApply }) => {
  const { data = {} } = useProjectOptions();
  const { statusOptions = [], createdByOptions = [], assignedTo = [] } = data;
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
            <div className={style.gridTwo}>
              <div>
                <SelectBox
                  options={statusOptions}
                  label={'Status'}
                  name={'status'}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  placeholder={'Select'}
                  dynamicClass={style.zDynamicState45}
                  showNumber
                  isMulti
                  id="testrun-filtermodal-status-selectbox"
                />
              </div>
              <div>
                <SelectBox
                  options={assignedTo}
                  label={'Assigned To'}
                  placeholder={'Select'}
                  name={'assignedTo'}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState4}
                  showNumber
                  isMulti
                  id="testrun-filtermodal-assignedto-selectbox"
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div className={style.dateDiv}>
                <DateRange
                  handleChange={(e) => onChange('dueDate', e)}
                  startDate={watch('dueDate')?.start}
                  endDate={watch('dueDate')?.end}
                  label={'Due Date'}
                  name={'dueDate'}
                  placeholder={'Select'}
                  control={control}
                  className={style.dateRange}
                  id="testrun-filtermodal-duedate"
                />
              </div>
              <div className={style.dateDiv}>
                <DateRange
                  handleChange={(e) => onChange('createdAt', e)}
                  startDate={watch('createdAt')?.start}
                  endDate={watch('createdAt')?.end}
                  label={'Created Date'}
                  name={'createdAt'}
                  placeholder={'Select'}
                  control={control}
                  className={style.dateRange}
                  id="testrun-filtermodal-createdate"
                />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div>
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
                  id="testrun-filtermodal-createdby-selectbox"
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
                data-cy="testrun-filtermodal-resetbtn"
              />
              <Button
                text={'Apply'}
                type="button"
                btnClass={style.applyClass}
                onClick={(e) => {
                  e.preventDefault();
                  onFilterApply();
                }}
                data-cy="testrun-filtermodal-applybtn"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
FiltersDrawer.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  noHeader: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
};

export default FiltersDrawer;
