import React from 'react';

import './Answer.css';
import { Link } from "react-router-dom";

import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { FaCheckCircle } from "react-icons/fa";

import { getVoteUUID, startVote, updateVote, deleteVote } from '../../api/api';


import moment from 'moment';

const Answer = ({answer, acceptAnswerFunc, updateWhole, is_login_user}) => {
  const AnswerContentHtml =  {
    __html: answer.content,
  }

  function handleVote({category, pk, value}) {
    getVoteUUID(category, pk)
    .then((response) => {
      if (response.data.length > 0) {
        // has voted before
        const vote = response.data[0];
        const vote_uuid = response.data[0]['uuid_id']
        
        if (vote.value === value) {
          // cancel upvote
          console.log('cancel');
          deleteVote(vote_uuid)
          .then((response) => {
            console.log(response);
          })
          .catch(console.log);
        } else {
          // switch to upvote
          console.log('switch');
          updateVote(vote_uuid, { value })
          .then((response) => {
            console.log(response);
          })
          .catch(console.log);
        }
      } else {
        // hasnt voted before, start a new upvote
        startVote({ category, pk, value })
        .then((response) => {
          console.log('new');
          console.log(response);
        })
        .catch(console.log);
      }
      updateWhole();
    })
    .catch(console.log);
  }

  function upVoteQuestion(category, pk) {
    handleVote({ category, pk, value: true })
  }

  function downVoteQuestion(category, pk) {
    handleVote({ category, pk, value: false })
  }

  let up_voted_class = ""
  let down_voted_class = ""

  for (const vote of answer.votes) {
    if (vote.user.is_login_user === true) {
      if (vote.value === true) {
        up_voted_class = "answer_voted"
      } else {
        down_voted_class = "answer_voted"
      }
      break;
    }
  }

  return (
    <div class="qa-answer-card">
      <div class="qa-answer-left">
        <AiFillCaretUp
          className={`qa-answer-up-down-icon ${up_voted_class}`}
          onClick={upVoteQuestion.bind(this, 'answer', answer.uuid_id)}
        />
        <span>{ answer.total_votes }</span>
        <AiFillCaretDown
          className={`qa-answer-up-down-icon ${down_voted_class}`}
          onClick={downVoteQuestion.bind(this, 'answer', answer.uuid_id)}
        />
        { 
          is_login_user === true ?
          <FaCheckCircle className={ answer.is_answer ? "accpted" : "acceptAnswer"} size={30} onClick={answer.is_answer ? undefined : acceptAnswerFunc}/> :
          ""
        }
      </div>
      <div class={ answer.is_answer ? "accpted-qa-answer-right" : "qa-answer-right" }>
        <div class="qa-answer-header">
          <Link className="no-textdecoration qa-answer-author-img" to={`/user/${answer.user.username}`}>
            <img alt="user" class="qa-answer-author-img" src="https://www.trendmicro.com/content/dam/trendmicro/global/en/global/logo/logo-desktop.png"/>
          </Link>
          <span class="qa-answer-author"><Link className="no-textdecoration" to={`/user/${answer.user.username}`}>{ answer.user.username }</Link></span>
          <span class="qa-answer-post-time">{ moment().to(moment(answer.updated_at)) }</span>
        </div>
        <div class="qa-answer-content" dangerouslySetInnerHTML={ AnswerContentHtml }/>
      </div>
    </div>
  )
}







export default Answer