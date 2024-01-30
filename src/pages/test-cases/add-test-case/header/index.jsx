import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import SelectBox from 'components/select-box';

import style from './header.module.scss';
import { sampleCsvData } from './helper';
import { useProjectOptions } from 'pages/test-cases/helper';
import { useToaster } from 'hooks/use-toaster';
import ImportModal from 'components/import-modal';
import { CSVLink } from 'react-csv';
import { useAppContext } from 'context/app.context';
import Permissions from 'components/permissions';
import ExportIcon from 'components/icon-component/export-icon';

const FilterHeader = ({
  allowResize,
  setAllowResize,
  control,
  watch,
  setValue,
  projectSpecific = '',
  submitFileImportHandler,
  csvData,
}) => {
  const { data = {} } = useProjectOptions();
  const { userDetails } = useAppContext();
  const { toastError } = useToaster();

  const [openImportModal, setOpenImportModal] = useState(false);
  const { projectOptions = [], mileStonesOptions = [], featuresOptions = [] } = data;

  const onAdd = () => {
    if (watch('projectId') && watch('milestoneId') && watch('featureId')) {
      setAllowResize(!allowResize);
    } else {
      toastError({
        msg: 'Please Select a Project, Milestone, or Feature to start adding new test',
      });
    }
  };

  const handleImport = () => {
    if (watch('projectId') && watch('milestoneId') && watch('featureId')) {
      setOpenImportModal(true);
    } else {
      toastError({
        msg: 'Please Select a Project, Milestone, or Feature to start adding new test',
      });
    }
  };
  const onSubmit = (data) => {
    submitFileImportHandler(data);
    setOpenImportModal(false);
  };

  useEffect(() => {
    if (projectSpecific) {
      setValue('projectId', projectSpecific);
    }
  }, [projectSpecific]);

  useEffect(() => {
    setValue('milestoneId', null);
  }, [watch('projectId')]);
  useEffect(() => {
    setValue('featureId', null);
  }, [watch('milestoneId')]);

  return (
    <>
      <div className={style.mainHeader}>
        <div className={style.grid}>
          <div className={style.inner}>
            {!projectSpecific && (
              <div className={style.statusBar} data-cy="project-input-filter">
                <SelectBox
                  name="projectId"
                  control={control}
                  badge
                  options={projectOptions}
                  label={'Project'}
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState4}
                  showNumber
                  currentValue={watch('status' || [])}
                  id={'project-input-dropdown-testcases'}
                  optionAttr={'option-project-testcase'}
                />
              </div>
            )}

            <div className={style.statusBar}>
              <SelectBox
                options={mileStonesOptions?.filter((x) => x.projectId === watch('projectId'))}
                label={'Milestone'}
                name={'milestoneId'}
                control={control}
                placeholder={watch('projectId') ? 'Select' : 'Select Project First'}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                id={'milestone-input-dropdown-testcases'}
              />
            </div>

            <div className={style.statusBar}>
              <SelectBox
                options={featuresOptions?.filter((x) => x.milestoneId === watch('milestoneId'))}
                label={'Feature'}
                name={'featureId'}
                control={control}
                placeholder={watch('milestoneId') ? 'Select' : 'Select Milestone First'}
                numberBadgeColor={'#39695b'}
                dynamicClass={style.zDynamicState4}
                showNumber
                id={'feature-input-dropdown-testcases'}
              />
            </div>
          </div>

          <div className={style.resetDiv} style={{ width: 'max-content' }}>
            <Button
              text="Add Test Case"
              handleClick={onAdd}
              className={style.maxContent}
              data-cy="add-test-case-btn-for-modal"
            />

            <Permissions
              allowedRoles={['Admin', 'Project Manager', 'QA']}
              currentRole={userDetails?.role}
              locked={userDetails?.activePlan === 'Free'}
            >
              <Button
                text="Import"
                startCompo={<ExportIcon />}
                btnClass={style.btn}
                handleClick={handleImport}
                data-cy={'import-testcases-btn'}
              />
            </Permissions>
            {csvData.length > 0 ? (
              <CSVLink data={csvData} filename={`Test Cases Export File ${new Date()}`}>
                <Permissions
                  allowedRoles={['Admin', 'Project Manager', 'QA']}
                  currentRole={userDetails?.role}
                  locked={userDetails?.activePlan === 'Free'}
                >
                  <Button text="Export" startCompo={<ExportIcon />} btnClass={style.btn} />
                </Permissions>
              </CSVLink>
            ) : (
              <Permissions
                allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                currentRole={userDetails?.role}
                locked={userDetails?.activePlan === 'Free'}
              >
                <Button
                  text="Export"
                  startCompo={<ExportIcon />}
                  btnClass={style.btn}
                  handleClick={() => {
                    toastError({ msg: 'No Data available to export' });
                  }}
                  data-cy={'export-testcases-btn'}
                />
              </Permissions>
            )}
          </div>
        </div>
      </div>

      <ImportModal
        openImportModal={openImportModal}
        setOpenImportModal={setOpenImportModal}
        name={'importTestCases'}
        sampleData={sampleCsvData}
        onSubmit={onSubmit}
      />
    </>
  );
};
FilterHeader.propTypes = {
  allowResize: PropTypes.bool,
  setAllowResize: PropTypes.func.isRequired,
  control: PropTypes.any.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  projectSpecific: PropTypes.string,
  submitFileImportHandler: PropTypes.func.isRequired,
  csvData: PropTypes.any,
};
export default FilterHeader;
