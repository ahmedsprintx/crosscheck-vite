import { useVerifyEmail } from 'hooks/api-hooks/settings/user-management.hook';
import { useToaster } from 'hooks/use-toaster';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _verifyEmail } = useVerifyEmail();

  const emailVerifyHandler = async () => {
    try {
      const res = await _verifyEmail({
        id: id,
      });

      if (res?.msg === 'Email Verified Successfully!') {
        toastSuccess(res.msg);
        navigate('/login');
      }
    } catch (error) {
      toastError(error, 'something went wrong');
      navigate('/login');
    }
  };

  useEffect(() => {
    emailVerifyHandler();
  });

  return (
    <div style={{ fontSize: '30px', textAlign: 'center', marginTop: '100px' }}>
      VerifyEmail in progress please wait...
    </div>
  );
};

export default VerifyEmail;
