import { useState } from 'react';

import Button from 'components/button';
import SelectBox from 'components/select-box';

import style from './header.module.scss';
import ResetPopup from './reset-popup';
import MoreFilter from 'components/icon-component/more-filter';

const FilterHeader = ({ mobileView, projectSpecific, control, watch, setValue, reset, onFilterApply, data }) => {
  const [openFilter, setOpenFilter] = useState(false);

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

  const [selectedDates, setSelectedDates] = useState();

  const onChange = (name, dates) => {
    const [start, end] = dates;
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
            {!projectSpecific && (
              <div className={style.statusBar} style={{ zIndex: '100' }}>
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
            <div className={style.statusBar} style={{ zIndex: '99' }}>
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

            <div className={style.statusBar} style={{ zIndex: '98' }}>
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
            <div className={style.statusBar} style={{ zIndex: '97' }}>
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
            <div className={style.statusBar} style={{ zIndex: '96' }}>
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
              />
            </div>
            <div className={style.statusBar} style={{ zIndex: '95' }}>
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

            {openFilter && (
              <ResetPopup
                control={control}
                setValue={setValue}
                watch={watch}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                onChange={onChange}
                options={{
                  severityOptions,
                  bugByOptions,
                  testTypeOptions,
                  reportedByOptions,
                  assignedToOptions,
                }}
              />
            )}
            <div className={style.allFilters}>
              <ResetPopup
                control={control}
                setValue={setValue}
                watch={watch}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                onChange={onChange}
                options={{
                  severityOptions,
                  bugByOptions,
                  testTypeOptions,
                  reportedByOptions,
                  assignedToOptions,
                }}
              />
            </div>
          </div>
          <div className={style.resetDiv}>
            <div
              onClick={() => setOpenFilter((prev) => !prev)}
              style={{
                padding: '5px',
                transform: openFilter ? 'rotate(180deg)' : '',
              }}
              className={style.openAllfilterBtn}
            >
              <MoreFilter />
            </div>

            <Button
              text={'Reset'}
              type="button"
              btnClass={style.reset}
              style={{ marginRight: '10px', marginLeft: '10px' }}
              onClick={(e) => {
                e.preventDefault();
                setSelectedDates();
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

export default FilterHeader;
