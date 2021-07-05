import React, { useEffect, useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux'
import axios from 'axios';
import LikeDislikes from './LikeDislikes'

function SingleComment(props) {

    const user = useSelector(state => state.user)

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]
    const handleChange=(e)=>{
        setCommentValue(e.currentTarget.value)
    }
    const onSubmit=(e)=>{
        e.preventDefault();

        const variable = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo:props.comment._id,
        }

        axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('커멘트를 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            />
            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textarea style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요" />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick>Submit</button>
                </form>
            }
        </div>
    )
}


export default SingleComment
