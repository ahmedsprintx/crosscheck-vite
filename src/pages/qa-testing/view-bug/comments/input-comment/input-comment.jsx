import { useForm } from 'react-hook-form';
import { useAddComment } from 'hooks/api-hooks/bugs/bugs.hook';
import { useToaster } from 'hooks/use-toaster';

import TextField from 'components/text-field';
import AttachFile from 'components/icon-component/attach-file';
import ArrowOutlined from 'components/icon-component/arrow-outlined';
import CommentAttachment from 'components/upload-attachments/comment-attachment/comment-attachment';

import style from './input.module.scss';
import CrossAttachment from 'components/icon-component/cross-icon';

const InputComment = ({ bugId, commentsRefetch }) => {
  const form = useForm({
    defaultValues: {
      commentText: '',
      attachment: [],
    },
  });

  const { mutateAsync: _addCommentHandler, isLoading: isAdding } = useAddComment();
  const { toastSuccess, toastError } = useToaster();
  const { register, control, handleSubmit, setValue, reset, watch } = form;

  const onSubmit = async (data) => {
    if ((Object.keys(data?.attachment).length > 0 || data?.commentText.trim() !== '') && !isAdding) {
      try {
        const body = {
          bugId: bugId,
          comment: data?.commentText,
          file: data?.attachment ? data?.attachment : [],
        };
        const res = await _addCommentHandler({ body });
        commentsRefetch();
        toastSuccess(res?.msg);
        reset();
      } catch (error) {
        toastError(error);
      }
    }
  };

  const handleDeleteAttachment = (url) => {
    const updatedAttachment = watch('attachment').filter((file) => file.url !== url);
    setValue('attachment', updatedAttachment);
  };

  return (
    <div className={style.main}>
      <div className={style.inputComment}>
        <div className={style.attachmentContainer}>
          {watch('attachment')?.length > 0 &&
            watch('attachment')?.map((file) => {
              return (
                <div className={style.file} key={file.url}>
                  <span>{file?.fileName}</span>
                  <span onClick={() => handleDeleteAttachment(file.url)}>
                    <CrossAttachment />
                  </span>
                </div>
              );
            })}
        </div>
        <form className={style.commentInput} onSubmit={handleSubmit(onSubmit)} noValidate id="addComment">
          <CommentAttachment
            icon={<AttachFile />}
            control={control}
            setValue={setValue}
            defaultValue={[]}
            name="attachment"
            className={style.attachment}
            watch={watch}
          />

          <TextField
            wraperClass={style.commentField}
            placeholder={'Write your comment here'}
            name={'commentText'}
            register={register}
          />
        </form>
      </div>

      <button
        form="addComment"
        className={style.sendBtn}
        type="submit"
        disabled={isAdding}
        style={{ opacity: isAdding ? '0.3' : '1' }}
      >
        <ArrowOutlined />
      </button>
    </div>
  );
};

export default InputComment;
