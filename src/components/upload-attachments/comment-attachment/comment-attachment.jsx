import React from 'react';
import { Controller } from 'react-hook-form';
import style from './comment-attachment.module.scss';
import { convertBase64Image } from 'utils/file-handler';

import { values } from 'utils/lodash';

const CommentAttachment = ({
  defaultValue,
  name,
  control,
  icon,
  className,
  setValue,
  register,
  watch,
}) => {
  const fileChangeHandler = async (files) => {
    try {
      const data = await Promise.all(
        values(files)?.map(async (file) => {
          const unidentifiedFileType = file?.name?.split('.')[1];
          const fileTypeFromExtension = file?.type || `application/${unidentifiedFileType}`;
          const blob = new Blob([file], { type: fileTypeFromExtension });
          const blobUrl = URL?.createObjectURL(blob);
          const base64 = await convertBase64Image(file);
          return {
            fileName: file.name,
            url: blobUrl,
            fileUrl: base64,
            fileType: fileTypeFromExtension,
          };
        }),
      );

      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const changeHandler = async (e) => {
    try {
      const files = e?.target?.files;
      if (files && files.length > 0) {
        const data = await fileChangeHandler(files);
        const prevAttachment = watch(name);
        setValue(name, [...prevAttachment, ...data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${style.file} ${className}`}>
      <>
        <input id={name} type="file" multiple onChange={(e) => changeHandler(e)} />
        <label htmlFor={name}>{icon}</label>
      </>
    </div>
  );
};

export default CommentAttachment;
