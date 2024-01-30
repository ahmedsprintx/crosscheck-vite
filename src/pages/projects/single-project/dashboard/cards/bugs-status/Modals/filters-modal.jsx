import React, { useState } from 'react';

// NOTE: components
import Modal from 'components/modal';

// NOTE: utils

// NOTE: styles
import style from './style-modal.module.scss';
import CrossIcon from 'components/icon-component/cross';
import SelectBox from 'components/select-box';
import Button from 'components/button';
import DateRange from 'components/date-range';
import { useBugsFiltersOptions } from '../../../helper';

const FiltersModal = ({ open, setOpen, setValue, reset, projectId, watch, className, control, onFilterApply }) => {
  const { data = {} } = useBugsFiltersOptions();
  const [selectedDates, setSelectedDates] = useState();
  const onChange = (name, dates) => {
    const [start, end] = dates;
    setSelectedDates((pre) => ({ ...pre, [name]: { start, end } }));
    setValue(name, { start, end });
  };
  const {
    mileStonesOptions = [],
    featuresOptions = [],
    severityOptions = [],
    bugTypeOptions = [],
    testTypeOptions = [],
    reportedByOptions = [],
    assignedToOptions = [],
    developersOptions = [],
    issueTypeOptions = [],
  } = data;

  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Apply Filters</span>
        <div onClick={setOpen} className={style.hover}>
          <CrossIcon />
        </div>
      </div>
      <div className={style.filtersGrid}>
        <div>
          <SelectBox
            options={mileStonesOptions.filter((x) => x.projectId === projectId)}
            label={'Milestone'}
            placeholder={'Select'}
            name={'milestones'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={
              projectId
                ? featuresOptions.filter((x) => watch('milestones')?.includes(x.milestoneId))
                : featuresOptions.filter((x) => watch('milestones')?.includes(x.milestoneId))
            }
            label={'Feature'}
            placeholder={'Select'}
            name={'features'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={testTypeOptions}
            label={'Testing Type'}
            placeholder={'Select'}
            name={'testingType'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={issueTypeOptions}
            label={'Issue Type'}
            placeholder={'Select'}
            name={'issueType'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={bugTypeOptions}
            label={'Bug Type'}
            placeholder={'Select'}
            name={'bugType'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={developersOptions}
            label={'Developer'}
            placeholder={'Select'}
            name={'developers'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={reportedByOptions}
            label={'Reported By'}
            placeholder={'Select'}
            name={'reportedBy'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <DateRange
            handleChange={(e) => onChange('reportedAt', e)}
            startDate={watch('reportedAt')?.start}
            endDate={watch('reportedAt')?.end}
            label={'Reported Date'}
            name={'reportedAt'}
            placeholder={'Select'}
            control={control}
          />
        </div>
        <div>
          <SelectBox
            options={severityOptions}
            label={'Severity'}
            placeholder={'Select'}
            name={'severity'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
          />
        </div>
        <div>
          <SelectBox
            options={assignedToOptions}
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
            setValue('reportedAt', { start: '', end: '' });
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
    </Modal>
  );
};

export default FiltersModal;
