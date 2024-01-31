import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import Button from 'components/button';
import { convertBase64Image, fileCaseHandler, handleFile } from 'utils/file-handler';

import tick from 'assets/tick-blue.svg';

import uploadIcon from 'assets/upload.svg';
import style from './image-upload.module.scss';
import { Controller } from 'react-hook-form';
import { useToaster } from 'hooks/use-toaster';
import UploadIcon from 'components/icon-component/upload-icon';
import Loader from 'components/loader';

const DragDrop = ({
  watch,
  className,
  isLoading,
  name,
  control,
  accept = {},
  defaultValue,
  rules = {},
  type = 'img',
  multiple = false,
  setValue,
  handleSubmit,
  backImg,
  backClass,
  maxSize = 10 * 1024 * 1024,
}) => {
  const { toastError } = useToaster();
  const [files, setFiles] = useState([]);

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    rejectedFiles.forEach((file) => {
      toastError({
        msg: file?.errors[0]?.code === 'file-too-large' ? 'File is Larger than 10MB' : file?.errors[0]?.message,
      });
    });
    acceptedFiles.forEach(async (file) => {
      const base64 = await convertBase64Image(file);
      const type = fileCaseHandler(file.type.split('/')[1]);

      multiple
        ? setFiles((pre) => [
            ...pre,
            {
              name: file.name,
              type,
              size: (file.size / (1024 * 1024))?.toFixed(3),
              attachment: base64,
            },
          ])
        : setFiles([
            {
              name: file.name.split('.')[0],
              type,
              size: (file.size / (1024 * 1024))?.toFixed(2),
              attachment: base64,
            },
          ]);
    });
  };

  useEffect(() => {
    if (files.length > 0) {
      setValue(name, files);
    }
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize,
    multiple,
    onDrop,
    accept,
  });

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={() => {
          return (
            <>
              {' '}
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className={`${style.wraper} ${className}`} data-testid={'wraper'}>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className={style.imgSection}>
                      {type === 'img' && watch(name)?.[0]?.attachment ? (
                        <img
                          className={`${type === 'img' && watch(name)?.[0]?.attachment ? style.profileImg : ''}   `}
                          src={`${watch(name)?.[0]?.attachment}`}
                          alt=""
                        />
                      ) : (
                        <div>{backImg ? <img src={backImg} alt="" /> : <UploadIcon />}</div>
                      )}
                    </div>
                  </div>
                  <div className={backClass}>
                    <p className={style.heading}>
                      Drop your file here or
                      <span className={style.selectFile}> Select a file</span>
                    </p>
                    {type !== 'img' && files.length > 0 && (
                      <div
                        style={{
                          marginTop: '20px',
                          display: 'flex',
                          gap: '10px',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <aside
                          style={{
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'center',
                          }}
                        >
                          <h4>Files</h4>
                          <ul>
                            {files?.map((x) => {
                              return (
                                <>
                                  <li>
                                    {x.name} - {x.size}MB
                                  </li>
                                </>
                              );
                            })}
                          </ul>
                        </aside>

                        {handleSubmit && (
                          <Button
                            text={'Submit'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubmit(files);
                              setFiles([]);
                            }}
                            disabled={isLoading}
                          />
                        )}
                        {isLoading && <Loader />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        }}
      />
    </>
  );
};

export default DragDrop;
