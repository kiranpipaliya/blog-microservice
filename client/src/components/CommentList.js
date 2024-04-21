import React from 'react'


const renderCommentItem = (comment) => {
let content; 

if (comment.status === "approved") {
  content = comment.content; 
}

if (comment.status === "pending") {
    content = 'This comment is waiting for moderation'; 
}

if (comment.status === "rejected") {
  content = 'This comment is Rejected'; 
}


return <li key={comment.id}> {content}</li>
}

const CommentList = ({comments}) => {
  return (
    <ul>
        {comments.map(renderCommentItem)}
    </ul>
  )
} 

export default CommentList