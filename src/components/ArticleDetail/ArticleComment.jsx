import React from 'react';

import './ArticleComment.css'

const ArticleComment = ({comment}) => {
  const commentHtml = { __html: comment.markdown_content }

  return (
    <div class="comment-card">
      <img class="comment-author-img" alt="user" src="http://img.liaogx.com/media%2Fcache%2Fcb%2F11%2Fcb115602df434de0d76ebee728f3a4b7.jpg" />
      <div class="comment-card-right">
        <span class="comment-author">{comment.user.username}</span>
        <div class="comment-content" dangerouslySetInnerHTML={ commentHtml }/>
      </div>
    </div>
  )
}

export default ArticleComment