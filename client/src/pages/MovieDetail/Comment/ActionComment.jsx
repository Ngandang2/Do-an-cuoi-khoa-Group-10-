import React, { useContext, useState } from 'react';
import { ActionCommentLayout, ButtonAction } from './Comment.Style';
import InputComment from './InputComment';
import { toast } from 'react-toastify';
import { AuthContext } from 'src/contexts/authContext';
import { useDispatch } from 'react-redux';
import { addFeedbackComments, clearComments, defautlCreateStatus, getAllComments } from 'src/reducers/commentSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import socketIO from 'socket.io-client';
import variables from 'src/contants/variablesContants';

let socket =  socketIO(variables.ENDPOINT, { transports:['websocket']});

const ActionComment = ({ createdAt, fullname, commentParentId, idRecipients,  onActive, active, isFetchComment, setListComment }) => {
    const { state } = useContext(AuthContext);
    const { id, isLogin } = state;
    
    const params = useParams();
    const dispatch = useDispatch();

    const handleFeedbackComment = async (cmtText) => {
        if(isLogin) {
            if(cmtText) {
                const data = {
                    comments: cmtText,
                    idUser: id,
                    nameTag: idRecipients === id ? '' : fullname,
                    idComment: commentParentId,
                    idChidrenUser: idRecipients,
                }

                const res = await dispatch(addFeedbackComments(data));
                const result = unwrapResult(res);
                socket.emit('joinRoom', {idComments: params.movieId});

                if(result.status === 200)
                {
                    onActive && onActive();
                    setTimeout(() => {
                        setListComment();
                        dispatch(getAllComments({movieId: params.movieId, currentPage: isFetchComment}));
                        dispatch(defautlCreateStatus());
                    }, 800);
                }
                else
                    toast.error('Add comment failed!');
            }
            else {
                toast.error('H??y vi???t g?? ???? cho b??nh lu???n n??y?');
            }
        }
        else
            toast.warn('B???n ch??a ????ng nh???p!');
    }

    return (
        <>
            <ActionCommentLayout>
                <ButtonAction>Th??ch</ButtonAction>
                <span> ?? </span>
                <ButtonAction
                    onClick={() => {
                        if(isLogin)
                            onActive && onActive();
                        else
                            toast.warn('B???n ch??a ????ng nh???p!\n Vui l??ng ????ng nh???p ????? ph???n h???i');
                    }}
                >
                    Ph???n h???i
                </ButtonAction>
                <span> ?? </span>
                <ButtonAction className="no-hover">{ createdAt }</ButtonAction>
            </ActionCommentLayout>
            {
                active && <InputComment 
                    placeholder="Ph???n h???i v??? b??nh lu???n n??y..."
                    onSubmit={(cmtText) => handleFeedbackComment(cmtText)}
                />
            }
        </>
    );
};


export default ActionComment;
