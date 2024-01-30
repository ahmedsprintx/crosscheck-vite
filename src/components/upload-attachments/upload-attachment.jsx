import TextField from 'components/text-field';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import style from './style.module.scss';

import RecordIcon from 'components// NOTE: icon-component/record';
import { useReactMediaRecorder } from 'react-media-recorder';
import { convertBase64Image, convertBlobToBase64 } from 'utils/file-handler';
import { useToaster } from 'hooks/use-toaster';
import DelIcon from 'components/icon-component/del-icon';

import UploadIconThin from 'components/icon-component/upload-icon-thin';

const UploadAttachment = ({
  name,
  rules,
  defaultValue,
  control,
  wraperClass,
  label,
  placeholder,
  errorMessage,
  setValue,
  register,
  isDisable,
  onTextChange,
}) => {
  const { toastError } = useToaster();
  const [isMicrophonePermissionGranted, setIsMicrophonePermissionGranted] = useState(true);
  const [fileInputKey, setFileInputKey] = useState(Date.now().toString()); // NOTE: Added key state

  useEffect(() => {
    navigator?.permissions?.query({ name: 'microphone' })?.then((result) => {
      if (result?.state === 'granted') {
        setIsMicrophonePermissionGranted(true);
      } else {
        setIsMicrophonePermissionGranted(false);
      }
    });
  }, []);

  const screenRecordHandler = async (blobUrl, blob) => {
    try {
      const base64 = await convertBlobToBase64(blobUrl, 'video/x-matroska');
      setValue(name, { url: blobUrl, base64 });
      clearBlobUrl();
    } catch (error) {
      clearBlobUrl();
      toastError({ msg: 'Failed to make base64' });
    }
  };

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({
    screen: true,
    video: true,
    audio: isMicrophonePermissionGranted,
    onStop: screenRecordHandler,
    stopStreamsOnStop: true,
  });

  const imageChangeHandler = async (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const blob = new Blob([e?.target?.files[0]], { type: file.type });
      const blobUrl = URL?.createObjectURL(blob);

      const base64 = await convertBase64Image(e?.target?.files[0]);
      setValue(name, { url: blobUrl, base64 });
    }
  };

  const onClear = () => {
    setValue(name, {});
    setFileInputKey(Date.now().toString()); // NOTE: Reset the file input by updating the key
  };

  return (
    <div className={`${style.inputContainer} ${wraperClass} `}>
      {label && <label>{label}</label>}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => {
          return (
            <div className={style.controller}>
              <div className={style.container}>
                <TextField
                  onChange={onTextChange}
                  placeholder={placeholder}
                  isDisable={isDisable}
                  value={field?.value?.url || ''}
                  backCompo={field?.value?.url && <DelIcon />}
                  errorMessage={!!errorMessage}
                  onClick={onClear}
                />
              </div>
              <div className={style.imgDiv}>
                <input
                  key={fileInputKey} // NOTE: Add key prop to the input
                  id={name}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={imageChangeHandler}
                />
                <label htmlFor={name} style={{ margin: 0, lineHeight: 0 }}>
                  {' '}
                  <UploadIconThin />
                </label>
                <div style={{ cursor: 'pointer' }} onClick={status === 'recording' ? stopRecording : startRecording}>
                  <RecordIcon />
                </div>
              </div>
            </div>
          );
        }}
      />
      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </div>
  );
};

const UploadAttachmentOnMobile = ({
  name,
  rules,
  defaultValue,
  control,
  wraperClass,
  label,
  placeholder,
  errorMessage,
  setValue,
  register,
  isDisable,
  onTextChange,
}) => {
  const [fileInputKey, setFileInputKey] = useState(Date.now().toString()); // NOTE: Added key state

  const imageChangeHandler = async (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const blob = new Blob([e?.target?.files[0]], { type: file.type });
      const blobUrl = URL?.createObjectURL(blob);

      const base64 = await convertBase64Image(e?.target?.files[0]);
      setValue(name, { url: blobUrl, base64 });
    }
  };

  const onClear = () => {
    setValue(name, {});
    setFileInputKey(Date.now().toString()); // NOTE: Reset the file input by updating the key
  };

  return (
    <div className={`${style.inputContainer} ${wraperClass} `}>
      {label && <label>{label}</label>}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => {
          return (
            <div className={style.controller}>
              <div className={style.container}>
                <TextField
                  onChange={onTextChange}
                  placeholder={placeholder}
                  isDisable={isDisable}
                  value={field?.value?.url || ''}
                  backCompo={field?.value?.url && <DelIcon />}
                  errorMessage={!!errorMessage}
                  onClick={onClear}
                />
              </div>
              <div className={style.imgDiv}>
                <input
                  key={fileInputKey}
                  id={name}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={imageChangeHandler}
                />
                <label htmlFor={name} style={{ margin: 0, lineHeight: 0 }}>
                  {' '}
                  <UploadIconThin />
                </label>
              </div>
            </div>
          );
        }}
      />
      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </div>
  );
};

const Component = ({
  name,
  rules,
  defaultValue,
  control,
  wraperClass,
  label,
  placeholder,
  errorMessage,
  setValue,
  register,
  isDisable,
  onTextChange,
}) => {
  const userAgent = navigator.userAgent;

  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return (
      <UploadAttachmentOnMobile
        {...{
          name,
          rules,
          defaultValue,
          control,
          wraperClass,
          label,
          placeholder,
          errorMessage,
          setValue,
          register,
          isDisable,
          onTextChange,
        }}
      />
    );
  }

  return (
    <UploadAttachment
      {...{
        name,
        rules,
        defaultValue,
        control,
        wraperClass,
        label,
        placeholder,
        errorMessage,
        setValue,
        register,
        isDisable,
        onTextChange,
      }}
    />
  );
};

export default Component;
