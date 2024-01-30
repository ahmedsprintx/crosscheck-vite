import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from 'components/button';
import SelectBox from 'components/select-box';

import style from './header.module.scss';
import ResetPopup from './reset-popup';
import { useProjectOptions } from '../helper';
import MoreFilter from 'components/icon-component/more-filter';

const FilterHeader = ({ projectSpecific = '', control, mobileView, watch, setValue, reset, onFilterApply }) => {
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

  const [openFilter, setOpenFilter] = useState(false);

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

  return (
    <>
      <div className={style.mainHeader} style={{ paddingBottom: mobileView ? '35px' : '' }}>
        <div className={style.grid}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'flex-end',
            }}
          >
            {!projectSpecific && (
              <div className={style.statusBar} style={{ zIndex: '100' }}>
                <SelectBox
                  name="projects"
                  control={control}
                  badge
                  options={projectOptions}
                  label={'Project'}
                  isMulti
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState5}
                  showNumber
                />
              </div>
            )}

            <div className={style.statusBar} style={{ zIndex: '99' }}>
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
                dynamicClass={style.zDynamicState5}
                showNumber
                isMulti
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
                placeholder={'Select'}
                control={control}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                isMulti
              />
            </div>
            <div className={style.statusBar} style={{ zIndex: '97' }}>
              <SelectBox
                name="status"
                control={control}
                badge
                options={statusOptions}
                label={'Status'}
                isMulti
                placeholder={'Select'}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                currentValue={watch('status' || [])}
              />
            </div>
            <div className={style.statusBar} style={{ zIndex: '96' }}>
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

            {openFilter && (
              <ResetPopup
                projectSpecific={projectSpecific}
                control={control}
                watch={watch}
                setValue={setValue}
                options={{
                  weighageOptions,
                  testTypeOptions,
                  lastTestedBy,
                }}
              />
            )}
            <div className={style.allFilters}>
              <ResetPopup
                projectSpecific={projectSpecific}
                control={control}
                watch={watch}
                setValue={setValue}
                options={{
                  weighageOptions,
                  testTypeOptions,
                  lastTestedBy,
                }}
              />
            </div>
          </div>
          <div className={style.resetDiv}>
            <div
              style={{
                padding: '5px',
                transform: openFilter ? 'rotate(180deg)' : '',
              }}
              onClick={() => setOpenFilter((prev) => !prev)}
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
FilterHeader.propTypes = {
  projectSpecific: PropTypes.string,
  control: PropTypes.any.isRequired,
  mobileView: PropTypes.bool.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  onFilterApply: PropTypes.func.isRequired,
};
export default FilterHeader;
