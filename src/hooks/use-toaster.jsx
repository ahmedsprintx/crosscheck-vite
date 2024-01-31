// NOTE: context

// NOTE: import { toast } from 'react-toastify';

// NOTE: export function useToaster() {
// NOTE:   const toastError = (error = {}, setError = () => {}, options = {}) => {
// NOTE:     if (error.validations) {
// NOTE:       Object.keys(error.validations).forEach((fieldName) => {
// NOTE:         setError(fieldName, {
// NOTE:           type: 'server',
// NOTE:           message: error.validations[fieldName],
// NOTE:         });
// NOTE:       });
// NOTE:     }
// NOTE:     return toast.error(`${error?.msg}`, options);
// NOTE:   };

// NOTE:   const toastSuccess = (message = '', options = {}) => {
// NOTE:     return toast.success(message, options);
// NOTE:   };

// NOTE:   return { toastError, toastSuccess };
// NOTE: }

import { toast } from 'react-toastify';

export const toastNotification = ({ title, body, icon, onClick, options = {} }) => {
  // NOTE: Specify the position option (default to 'top-right' if not provided)

  return toast.info(
    <div onClick={onClick} style={{ color: 'black' }}>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {icon && <img src={icon} alt="" style={{ width: '30px', height: '30px', borderRadius: '30px' }}></img>}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 600 }}>{title}</p>
          <p style={{ fontSize: '13px' }}> {body}</p>
        </div>
      </div>
    </div>,
    options,
  );
};

export function useToaster() {
  const toastError = (error = {}, setError = () => {}, options = {}) => {
    if (error.validations) {
      Object.keys(error.validations).forEach((fieldName) => {
        setError(fieldName, {
          type: 'server',
          message: error.validations[fieldName],
        });
      });
    }

    // NOTE: Specify the position option (default to 'top-right' if not provided)

    return toast.error(`${error?.msg}`, {
      ...options, // NOTE: Include other options
    });
  };
  // NOTE: console.log({options});

  const toastSuccess = (message = '', options = {}) => {
    // NOTE: Specify the position option (default to 'top-right' if not provided)

    return toast.success(message, {
      // NOTE: toastId:"Hello World",
      ...options, // NOTE: Include other options
    });
  };

  return { toastError, toastSuccess, toastNotification };
}
