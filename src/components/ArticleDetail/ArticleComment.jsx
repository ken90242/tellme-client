import React from 'react';

import './ArticleComment.css'
import userDefaultImg from '../../static/img/default-user.png'

const ArticleComment = ({comment}) => {
  const commentHtml = { __html: comment.markdown_content }

  return (
    <div class="comment-card">
      <img
        class="comment-author-img"
        alt="user"
        src={comment.user.picture ? comment.user.picture.file : userDefaultImg } />
      <div class="comment-card-right">
        <span class="comment-author">{comment.user.username}</span>
        <div class="comment-content" dangerouslySetInnerHTML={ commentHtml }/>
      </div>
    </div>
  )
}

export default ArticleComment