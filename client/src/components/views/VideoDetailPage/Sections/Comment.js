import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
    const postId = props.postId
    const user = useSelector(state => state.user)

    const [commentValue, setcommentValue] = useState("")

    const handleChange = (e) => {
        setcommentValue(e.currentTarget.value)
    }
    const onSubmit = (e) => {
        e.preventDefault();

        const variable = {
            content: commentValue,
            writer: user.userData._id,
            postId: postId
        }

        axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if (response.data.success) {
                    setcommentValue("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('커멘트를 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={postId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={postId} commentLists={props.commentLists}/>
                    </React.Fragment>
                )
            ))}

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요" />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment
