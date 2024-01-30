import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useUpdateClickUp } from 'hooks/api-hooks/settings/user-management.hook';
import { useToaster } from 'hooks/use-toaster';

import TextField from 'components/text-field';
import Button from 'components/button';
import Modal from 'components/modal';

import style from './login.module.scss';

const ChangeClickupId = ({ setChangeClickup, changeClickup, setOpenMenu }) => {
  const {
    register,
    setError,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm();
  const { mutateAsync: _updateClickupId, isLoading: _isSubmitting } = useUpdateClickUp();
  const { toastSuccess, toastError } = useToaster();

  const passwordChangeHandler = async () => {
    try {
      const formData = {
        newClickUpId: watch('newClickUpId'),
      };
      const res = await _updateClickupId({
        id: changeClickup?.id,
        body: formData,
      });
      setChangeClickup(null);
      toastSuccess(res.msg);
      setOpenMenu(null);
    } catch (error) {
      toastError(error, setError);
    }
  };

  useEffect(() => {
    changeClickup.clickUpId && setValue('newClickUpId', changeClickup.clickUpId ? changeClickup.clickUpId : '');
  }, [changeClickup]);
  return (
    <form onSubmit={handleSubmit(passwordChangeHandler)}>
      <Modal open={!!changeClickup?.id} handleClose={() => setChangeClickup(null)} className={style.mainDiv}>
        <div className={style.flex1}>
          <p className={style.p}>Edit Clickup ID </p>

          <TextField
            required
            label="Clickup ID"
            register={() =>
              register('newClickUpId', {
                required: 'Required ',
              })
            }
            name="newClickUpId"
            type="number"
            wraperClass={style.label}
            errorMessage={errors.newClickUpId && errors.newClickUpId.message}
          />
        </div>
        <div className={style.mainBtnDiv}>
          <p onClick={() => setChangeClickup(null)}>Cancel</p>
          <Button text={'Save'} type="submit" disabled={_isSubmitting} />
        </div>
      </Modal>
    </form>
  );
};

ChangeClickupId.propTypes = {
  setChangeClickup: PropTypes.func.isRequired,
  changeClickup: PropTypes.any.isRequired,
  setOpenMenu: PropTypes.func.isRequired,
};

export default ChangeClickupId;
