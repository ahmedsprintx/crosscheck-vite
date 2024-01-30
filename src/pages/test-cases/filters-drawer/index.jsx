import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useProjectOptions } from '../helper';
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
  noHeader,
  setValue,
  reset,
  onFilterApply,
}) => {
  const { data = {} } = useProjectOptions();

  const {
    projectOptions = [],
    mileStonesOptions = [],
    featuresOptions = [],
    statusOptions = [],
    weighageOptions = [],
    testTypeOptions = [],
    createdByOptions = [],
    lastTestedBy = [],
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
                    name="projects"
                    control={control}
                    badge
                    options={projectOptions}
                    label={'Project'}
                    isMulti
                    placeholder={'Select'}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    id="testcase-filtermodal-project"
                  />
                </div>
              )}
              <div>
                <SelectBox
                  options={
                    projectSpecific
                      ? mileStonesOptions.filter((x) => x.projectId === projectSpecific)
                      : mileStonesOptions.filter((x) => watch('projects')?.includes(x.projectId))
                  }
                  label={'Milestone'}
                  name={'milestones'}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  placeholder={'Select'}
                  showNumber
                  isMulti
                  id="testcase-filtermodal-miestone"
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
                  placeholder={'Select'}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                  id="testcase-filtermodal-feature"
                />
              </div>
              <div>
                <SelectBox
                  name="status"
                  control={control}
                  badge
                  options={statusOptions}
                  label={'Status'}
                  isMulti
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  currentValue={watch('status' || [])}
                  id="testcase-filtermodal-status"
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div className={style.dateDiv}>
                <DateRange
                  handleChange={(e) => onChange('createdAt', e)}
                  startDate={watch('createdAt')?.start}
                  endDate={watch('createdAt')?.end}
                  label={'Created Date'}
                  placeholder={'Select'}
                  name={'createdAt'}
                  control={control}
                  id="testcase-filtermodal-daterange"
                />
              </div>
              <div className={style.dateDiv}>
                <SelectBox
                  options={createdByOptions}
                  label={'Created By'}
                  placeholder={'Select'}
                  name={'createdBy'}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                  id="testcase-filtermodal-createdby"
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div className={style.dateDiv}>
                <DateRange
                  handleChange={(e) => onChange('lastTestedAt', e)}
                  startDate={watch('lastTestedAt')?.start}
                  endDate={watch('lastTestedAt')?.end}
                  label="Last Tested Date"
                  name="lastTestedAt"
                  control={control}
                  placeholder={'Select'}
                  id="testcase-filtermodal-lasttesteddate"
                />
              </div>
              <div className={style.dateDiv}>
                <SelectBox
                  options={lastTestedBy}
                  label={'Last Tested By'}
                  name={'lastTestedBy'}
                  control={control}
                  placeholder="Select"
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                  id="testcase-filtermodal-lasttestedby"
                />
              </div>
            </div>
            <div className={style.gridTwo} style={{ marginTop: '10px' }}>
              <div>
                <SelectBox
                  options={testTypeOptions}
                  label={'Test Type'}
                  name={'testType'}
                  control={control}
                  placeholder="Select"
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                  id="testcase-filtermodal-testtype"
                  isSearchable={false}
                />
              </div>
              <div>
                <SelectBox
                  options={[
                    { label: 'Active', value: 'Active', checkbox: true },
                    { label: 'Obsolete', value: 'Obsolete', checkbox: true },
                  ]}
                  label={'State'}
                  name={'state'}
                  control={control}
                  placeholder="Select"
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                  id="testcase-filtermodal-state"
                  isSearchable={false}
                />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div>
                <SelectBox
                  options={weighageOptions}
                  label={'Weightage'}
                  name={'weightage'}
                  control={control}
                  placeholder="Select"
                  numberBadgeColor={'#39695b'}
                  showNumber
                  isMulti
                  id="testcase-filtermodal-weightage"
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
                data-cy="testcase-filtermodal-reset-btn"
              />
              <Button
                text={'Apply'}
                type="button"
                btnClass={style.applyClass}
                onClick={(e) => {
                  e.preventDefault();
                  onFilterApply();
                }}
                data-cy="testcase-filtermodal-apply-btn"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
FiltersDrawer.propTypes = {
  projectSpecific: PropTypes.string,
  setDrawerOpen: PropTypes.func.isRequired,
  control: PropTypes.any.isRequired,
  watch: PropTypes.func.isRequired,
  noHeader: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
};

export default FiltersDrawer;
