import React, { useRef, useState } from 'react';

import GenericTable from 'components/generic-table';

import { columnsData, rows } from './helper';
import { debounce as _debounce } from 'utils/lodash';

import style from './file.module.scss';
import DragDrop from 'components/drag-drop';
import { useParams } from 'react-router-dom';
import {
  useDeleteProjectFile,
  useGetProjectFiles,
  useRenameProjectFile,
  useUploadProjectFiles,
} from 'hooks/api-hooks/projects/files.hook';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'components/button';
import { useToaster } from 'hooks/use-toaster';
import RenameFile from './rename-file';
import DeleteModal from 'components/delete-modal';
import { fileCaseHandler } from 'utils/file-handler';
import Loader from 'components/loader';
import MainWrapper from 'components/layout/main-wrapper';

const FilesSection = ({ noHeader, projectId }) => {
  const { control, watch, setValue, setError } = useForm();
  const { toastSuccess, toastError } = useToaster();

  const [search, setSearch] = useState('');

  const {
    data: _projectFiles,
    refetch,
    isLoading: _loadingFetch,
    isFetching: _isFilesFetching,
  } = useGetProjectFiles({ projectId, search });

  const { mutateAsync: _uploadFileHandler, isLoading: _loadingUpload } = useUploadProjectFiles();
  const { mutateAsync: _renameFileHandler, isLoading: _loadingRename } = useRenameProjectFile();
  const { mutateAsync: _deleteFileHandler, isLoading: _loadingDelete } = useDeleteProjectFile();
  const ref = useRef();

  const [openRenameModal, setOpenRenameModal] = useState({});
  const [openDelModal, setOpenDelModal] = useState('');

  const uploadFiles = async (files) => {
    try {
      const res = await _uploadFileHandler({
        id: projectId,
        body: {
          ...files[0],
          type: fileCaseHandler(files[0].type),
        },
      });
      toastSuccess(res.msg);
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const onRename = async (id, body, setError) => {
    try {
      const res = await _renameFileHandler({ id, body });
      toastSuccess(res.msg);
      setOpenRenameModal({});
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await _deleteFileHandler(id);
      toastSuccess(res.msg);
      setOpenDelModal({});
      refetch();
    } catch (error) {
      toastError(error);
    }
  };

  const columns = useMemo(() => {
    return columnsData({
      setOpenRenameModal,
      setOpenDelModal,
      searchedText: search,
    });
  }, [search]);

  return (
    <>
      <MainWrapper
        title={'Files'}
        stylesBack={noHeader ? { marginTop: '10px' } : {}}
        noHeader={noHeader}
        searchField
        onSearch={_debounce((e) => {
          setSearch(e.target.value);
        }, 1000)}
        onClear={_debounce((e) => {
          setSearch('');
        }, 1000)}
      >
        <div className={style.main}>
          <DragDrop
            isLoading={_loadingUpload}
            name={'projectFile'}
            label={'Files'}
            control={control}
            setValue={setValue}
            watch={watch}
            type="file"
            handleSubmit={uploadFiles}
            maxSize={10 * 1024 * 1024}
            accept={{
              'application/*': ['.docx', '.pdf', '.txt', '.doc', '.csv', '.pptx', '.ppt', '.xlsx'],
            }}
            btnText="Remove Photo"
          />
          <h5>Files ({_projectFiles?.files?.length || 0})</h5>
          {_loadingFetch || _isFilesFetching ? (
            <Loader />
          ) : (
            <div className={style.tableWidth}>
              <GenericTable
                ref={ref}
                columns={columns}
                dataSource={_projectFiles?.files || []}
                height={'calc(100vh - 335px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
              />
            </div>
          )}
        </div>
      </MainWrapper>

      <RenameFile
        openRenameModal={!!openRenameModal?._id}
        setOpenRenameModal={() => setOpenRenameModal({})}
        defaultValue={openRenameModal?.name}
        handleSubmitFile={(body, setError) => onRename(openRenameModal?._id, body, setError)}
        isLoading={_loadingRename}
      />
      <DeleteModal
        openDelModal={!!openDelModal?._id}
        setOpenDelModal={setOpenDelModal}
        name={'File'}
        isLoading={_loadingDelete}
        backClass={style.modal}
        clickHandler={() => {
          onDelete(openDelModal?._id);
        }}
      />
    </>
  );
};

export default FilesSection;
