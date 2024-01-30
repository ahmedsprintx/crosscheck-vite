/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useInviteUser } from 'hooks/api-hooks/settings/user-management.hook';
import { useToaster } from 'hooks/use-toaster';

import TextField from 'components/text-field';
import Button from 'components/button';
import Modal from 'components/modal';

import style from './login.module.scss';
import SelectBox from 'components/select-box';
import { emailValidate } from 'utils/validations';

const InviteModal = ({ setInviteUser, inviteUser, refetchInvites }) => {
  const {
    register,
    setError,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();

  const { toastSuccess, toastError } = useToaster();

  // NOTE: change member role
  const { mutateAsync: _inviteUser, isLoading: isSubmitting } = useInviteUser();

  const inviteUserHandler = async (data) => {
    const formData = {
      email: data?.email,
      roleName: data?.roleName,
    };

    try {
      const res = await _inviteUser({
        body: formData,
      });
      toastSuccess(res.msg);
      setInviteUser(null);
      refetchInvites();
    } catch (error) {
      toastError(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(inviteUserHandler)}>
      <Modal open={inviteUser} handleClose={() => setInviteUser(false)} className={style.mainDiv}>
        <div className={style.flex1}>
          <p className={style.p}> Invite User </p>

          <TextField
            label="Email"
            name="email"
            required
            register={() =>
              register('email', {
                required: 'Required',
                validate: emailValidate,
              })
            }
            placeholder="e.g., johndoe@company.com"
            type="email"
            errorMessage={errors.email && errors.email.message}
          />
          <SelectBox required control={control} name={'roleName'} label={'Role'} options={roles} />
        </div>
        <div className={style.mainBtnDiv}>
          <p onClick={() => setInviteUser(false)}>Cancel</p>
          <Button text={'Save'} type="submit" disabled={isSubmitting} />
        </div>
      </Modal>
    </form>
  );
};
InviteModal.propTypes = {
  setInviteUser: PropTypes.func.isRequired,
  inviteUser: PropTypes.object.isRequired, // NOTE: Adjust the PropTypes based on the actual type
  refetchInvites: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default InviteModal;

const roles = [
  { value: 'Admin', label: 'Admin' },
  { value: 'QA', label: 'QA' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Developer', label: 'Developer' },
];
