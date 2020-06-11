import React from 'react';

import { Button, Tag } from 'element-react';
import './QA.css'
import { Link } from "react-router-dom";

const QA = ({question}) => {
  const QuestionContentHtml =  {
    __html: question.content,
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-header-left">
          <div className="qa-answer">
            <span className="qa-answer-count">{ question.answer.length }</span>
            <span className="qa-answer-label">answers</span>
          </div>
          <div className="qa-vote">
            <span className="qa-vote-count">{ question.votes.length }</span>
            <span className="qa-vote-label">votes</span>
          </div>
        </div>
        <div className="question-header-right">
          <h2 className="question-header-title">
            <Link className="no-textdecoration" to={`/qa/${question.slug}`}>
              { question.title }
            </Link>
          </h2>
          <div className="question-header-content" dangerouslySetInnerHTML={ QuestionContentHtml }/>
        </div>
      </div>
      <div className="question-footer">
        <span className="questoin-author question-footer-element">
          <Link className="no-textdecoration" to={`/user/${ question.user.username }`}>{ question.user.username }</Link>
        </span>
        <div className="question-tag-group question-footer-element">
          { question.tags.map((tag, idx) => <Tag key={idx} className="question-tag" color="#007bff">{tag}</Tag>) }
        </div>
        <span className="question-post-date question-footer-element">12 months ago</span>
      </div>
    </div>
  )
}


export default QA
