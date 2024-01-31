import { useState } from 'react';
import { useAppContext } from 'context/app.context';
import { useDeleteComment, useGetComments } from 'hooks/api-hooks/bugs/bugs.hook';
import { useToaster } from 'hooks/use-toaster';
import DeleteModal from 'components/delete-modal';

import style from './comments.module.scss';
import Comment from './comment-container';
import InputComment from './input-comment/input-comment';

const Comments = ({ bugId }) => {
  const { data: _commentsData, refetch: commentsRefetch } = useGetComments(bugId);
  const { userDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _deleteCommentHandler } = useDeleteComment();
  const [openDelModal, setOpenDelModal] = useState(false);
  const [commentId, setCommentId] = useState('');
  const [editComment, setEditComment] = useState('');

  const deleteHandler = async () => {
    if (commentId) {
      try {
        setOpenDelModal(false);
        const res = await _deleteCommentHandler({ commentId });
        await commentsRefetch();
        toastSuccess(res?.msg);
      } catch (error) {
        toastError(error);
      }
    }
  };

  return (
    <div className={style.mainComments}>
      {openDelModal && (
        <DeleteModal
          openDelModal={openDelModal}
          setOpenDelModal={setOpenDelModal}
          clickHandler={deleteHandler}
          name={'comment'}
        />
      )}

      <div className={style.comments}>
        {_commentsData?.comments.map((comment) => {
          return (
            <Comment
              key={comment._id}
              comment={comment}
              editComment={editComment}
              setEditComment={setEditComment}
              setOpenDelModal={setOpenDelModal}
              setCommentId={setCommentId}
              userDetails={userDetails}
              bugId={bugId}
              commentsRefetch={commentsRefetch}
            />
          );
        })}
      </div>
      <div className={style.inputField}>
        <InputComment bugId={bugId} commentsRefetch={commentsRefetch} />
      </div>
    </div>
  );
};

export default Comments;
