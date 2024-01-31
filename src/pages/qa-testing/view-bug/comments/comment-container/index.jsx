import { useState } from 'react';

import Permissions from 'components/permissions';
import DelIcon from 'components/icon-component/del-icon';
import EditIcon from 'components/icon-component/edit-icon';
import Button from 'components/button';
import AttachFile from 'components/icon-component/attach-file';
import style from './comment.module.scss';
import { useForm } from 'react-hook-form';
import { formattedDate } from 'utils/date-handler';
import { useEditComment } from 'hooks/api-hooks/bugs/bugs.hook';
import CommentAttachment from 'components/upload-attachments/comment-attachment/comment-attachment';
import TextField from 'components/text-field';
import { useToaster } from 'hooks/use-toaster';
import CrossAttachment from 'components/icon-component/cross-icon';
import FileAttachment from 'components/icon-component/file-attachment';
import Video from 'components/icon-component/video';
import Document from 'components/icon-component/document';
import CompressedFile from 'components/icon-component/compressed-file';
import Image from 'components/icon-component/image';
import { fileCaseHandler } from 'utils/file-handler';

const Comment = ({
  comment,
  setOpenDelModal,
  setCommentId,
  editComment,
  setEditComment,
  userDetails,
  bugId,
  commentsRefetch,
}) => {
  const form = useForm({
    defaultValues: {
      editedText: comment?.comment,
      file: [],
    },
  });
  const { register, control, watch, reset, setValue, handleSubmit } = form;
  const { mutateAsync: _editCommentHandler } = useEditComment();
  const formatDate = formattedDate(comment.updatedAt, "dd MMM',' yyyy 'at' hh:mm a");
  const { toastSuccess, toastError } = useToaster();

  const [discardedAttachments, setDiscardedAttachments] = useState([]);

  const deleteHandler = () => {
    setOpenDelModal(true);
    setCommentId(comment._id);
  };

  const editHandler = () => {
    setEditComment(comment._id);
    setValue('editedText', comment?.comment);
    setValue('file', comment?.file);
  };

  const discardEditedComment = () => {
    setEditComment('');
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const body = {
        bugId: bugId,
        comment: data.editedText,
        file: data?.file ? data?.file : [],
        discardedFiles: discardedAttachments.length > 0 ? discardedAttachments : [],
      };

      setEditComment('');
      const res = await _editCommentHandler({ commentId: comment._id, body });
      await commentsRefetch();
      reset();
      toastSuccess(res?.msg);
    } catch (error) {
      toastError(error);
    }
  };

  const handleDeleteAttachment = (fileKey) => {
    const updatedAttachment = watch('file').filter((file) => (file?.url ? file?.url : file?.fileKey) !== fileKey);
    const discardedAttachment = watch('file').find((file) => file.fileKey === fileKey);

    if (discardedAttachment) {
      setDiscardedAttachments([...discardedAttachments, discardedAttachment]);
    }

    setValue('file', updatedAttachment);
  };

  const FileIcon = ({ type }) => {
    const imageTypes = ['jpeg', 'png', 'gif', 'bmp'];
    const videoTypes = ['mp4', 'mov', 'wmv', 'mkv'];
    const documentTypes = [
      'pdf',
      'word',
      'text',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'txt',
      'md',
      'rtf',
      'csv',
    ];
    const compressedTypes = ['zip', 'rar'];
    const fileExtension = type?.split('/')[1];
    const formattedExtension = fileCaseHandler(fileExtension);

    switch (true) {
      case imageTypes.includes(formattedExtension):
        return <Image />;
      case videoTypes.includes(formattedExtension):
        return <Video />;
      case documentTypes.includes(formattedExtension):
        return <Document />;
      case compressedTypes.includes(formattedExtension):
        return <CompressedFile />;
      default:
        return <FileAttachment />;
    }
  };

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div className={style.dpName}>
          <img alt="" src={comment?.createdBy?.profilePicture} className={style.profilePicture} />
          <span>{comment?.createdBy?.name}</span>
        </div>

        <div className={style.iconDate}>
          <p className={style.date}>{formatDate}</p>
          {userDetails?.id === comment?.createdBy._id ? (
            <div className={style.editDeleteIcon}>
              <div onClick={editHandler}>
                <EditIcon />
              </div>
              <div onClick={deleteHandler}>
                <DelIcon />
              </div>
            </div>
          ) : (
            <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
              <div className={style.editDeleteIcon}>
                <div onClick={deleteHandler}>
                  <DelIcon />
                </div>
              </div>
            </Permissions>
          )}
        </div>
      </div>
      {editComment === comment._id ? (
        <form onSubmit={handleSubmit(onSubmit)} className={style.editForm}>
          <div className={style.attachmentContainer}>
            <div className={style.file}>
              {watch('file')?.length > 0 &&
                watch('file')?.map((file) => {
                  return (
                    <div className={style.file} key={file?.fileKey}>
                      <FileIcon type={file.fileType} />
                      <a href={file?.fileUrl} target="_blank" rel="noreferrer">
                        {file?.fileName}
                      </a>
                      <span onClick={() => handleDeleteAttachment(file?.url ? file?.url : file?.fileKey)}>
                        <CrossAttachment />
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
          <TextField register={register} control={control} autoFocus name={'editedText'} className={style.editField} />
          <div className={style.editModeFooter}>
            <div className={style.editModebtns}>
              <CommentAttachment
                register={register}
                icon={<AttachFile />}
                control={control}
                setValue={setValue}
                defaultValue={[]}
                name="file"
                watch={watch}
              />
              <Button text={'Discard'} btnClass={style.btn} handleClick={discardEditedComment} />
              <Button text={'Save'} type={'submit'} />
            </div>
          </div>
        </form>
      ) : (
        <div className={style.body}>
          <div className={style.attachmentContainer}>
            {comment?.file?.length > 0 &&
              comment?.file?.map((file, i) => {
                return (
                  <div className={style.attachmentFile} key={i}>
                    <FileIcon type={file.fileType} />
                    <a href={file?.fileUrl} target="_blank" rel="noreferrer">
                      {file?.fileName}
                    </a>
                  </div>
                );
              })}
          </div>
          <p>{comment?.comment}</p>
        </div>
      )}
    </div>
  );
};

export default Comment;
