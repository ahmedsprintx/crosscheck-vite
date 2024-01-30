import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/button';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';

import style from './header.module.scss';
import ResetPopup from './reset-popup';
import { useProjectOptions } from '../helper';

const FilterHeader = ({ control, watch, setValue, mobileView, reset, onFilterApply }) => {
  const [openFilter] = useState(false);

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
      <div className={style.mainHeader} style={{ paddingBottom: mobileView ? '35px' : '' }}>
        <div className={style.grid}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div className={style.statusBar} style={{ zIndex: '100' }}>
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
              />
            </div>
            <div className={style.statusBar} style={{ zIndex: '99' }}>
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
              />
            </div>

            <div className={style.statusBar} style={{ zIndex: '98' }}>
              <DateRange
                handleChange={(e) => onChange('dueDate', e)}
                startDate={watch('dueDate')?.start}
                endDate={watch('dueDate')?.end}
                label={'Due Date'}
                name={'dueDate'}
                placeholder={'Select'}
                control={control}
              />
            </div>
            <div className={style.datePicker}>
              <DateRange
                handleChange={(e) => onChange('createdAt', e)}
                startDate={watch('createdAt')?.start}
                endDate={watch('createdAt')?.end}
                label={'Created At'}
                name={'createdAt'}
                placeholder={'Select'}
                control={control}
              />
            </div>
            <div className={style.datePicker} style={{ zIndex: '97' }}>
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

      {openFilter && <ResetPopup control={control} />}
    </>
  );
};
FilterHeader.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  mobileView: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
};
export default FilterHeader;
