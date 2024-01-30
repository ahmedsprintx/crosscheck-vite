import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addDays } from 'date-fns';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

// NOTE: components
import Modal from 'components/modal';
import TextField from 'components/text-field';
import DatePicker from 'components/date-picker';
import Button from 'components/button';

// NOTE: hooks
import { useAddShareableLink, useEditShareableLink } from 'hooks/api-hooks/projects/dashboard.hook';

// NOTE: utils
import { formattedDate } from 'utils/date-handler';
// NOTE: assets
import CrossIcon from 'components/icon-component/cross';
import infoIcon from 'assets/infoIcon.svg';
import copyIcon from 'assets/copy-outline.svg';

// NOTE: styles
import style from './style-modal.module.scss';
import { useToaster } from 'hooks/use-toaster';
import { envObject } from 'constants/environmental';

const ShareModal = ({ open, setOpen }) => {
  const { control, watch } = useForm();
  const [initialRender, setInitialRender] = useState(true); // NOTE: Add a flag to track initial render
  const { BASE_URL } = envObject;

  const { id: _projectId } = useParams();

  const { toastError, toastSuccess } = useToaster();

  const [uniqueLink, setUniqueLink] = useState(''); // NOTE: State to store the uniqueLink

  const { mutateAsync: _addLinkHandler } = useAddShareableLink();
  const { mutateAsync: _editLinkHandler } = useEditShareableLink();

  const addLink = async () => {
    try {
      if (uniqueLink) {
        return;
        // NOTE: newUniqueLink is present it should not generate more
      }
      const newId = uuidv4();
      const newUniqueLink = `${BASE_URL}/bug-report/${newId}`;
      setUniqueLink(newUniqueLink);

      await _addLinkHandler({
        link: newUniqueLink,
        expiryDate: formattedDate(watch('expiresOn'), 'yyyy-MM-dd'),
        projectId: _projectId,
      });
    } catch (e) {
      toastError(e);
    }
  };
  const editLink = async () => {
    try {
      await _editLinkHandler({
        link: uniqueLink,
        expiryDate: formattedDate(watch('expiresOn'), 'yyyy-MM-dd'),
      });
    } catch (e) {
      toastError(e);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(uniqueLink)
      .then(() => {
        // NOTE: Successfully copied to clipboard
        // NOTE: You can optionally show a success message here
        toastSuccess('Link copied to clipboard');
        console.log('Link copied to clipboard:', uniqueLink);
      })
      .catch((error) => {
        // NOTE: Handle errors if copying to clipboard fails
        toastError('Link copied to clipboard');

        console.error('Copy to clipboard failed:', error);
      });
  };

  useEffect(() => {
    if (!initialRender) {
      // NOTE: Check if it's not the initial render
      editLink();
    }
  }, [watch('expiresOn')]);

  useEffect(() => {
    addLink();
    setInitialRender(false); // NOTE: Update the flag after the initial render
  }, []);

  return (
    <Modal open={open} handleClose={setOpen} className={style.modalClass}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Shareable link</span>
        <div onClick={setOpen} className={style.hover}>
          <CrossIcon />
        </div>
      </div>

      <div className={style.main}>
        <img src={infoIcon} alt=""></img> <p>This link will not be accessible after expiry date.</p>
      </div>

      <div className={style.innerWrapper}>
        <TextField label={'Link'} name="link" isDisable value={uniqueLink} />
        <div className={style.divWrapperInner}>
          <DatePicker
            control={control}
            label={'Expires On'}
            name={'expiresOn'}
            placeholder={'Select'}
            defaultVal={addDays(new Date(), 1)}
          />
          <Button
            text={'Copy Link'}
            handleClick={copyToClipboard}
            iconStart={copyIcon}
            btnClass={style.btnClass}
            className={style.btnTitle}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
