import React from 'react';

import './Message.css';
import { Link } from "react-router-dom";
import userDefaultImg from '../../static/img/default-user.png'
import moment from 'moment';


const Message = ({ message }) => {
  return (
    <li class="chat-message">
      <div class="chat-message-author-img-wrapper">
        <img
          src={ message.sender.picture ? message.sender.picture.file : userDefaultImg}
          alt="author-img"
          class="chat-message-author-img"/>
      </div>
      <div class="chat-message-block">
        <div class="chat-message-title">
          <span class="chat-message-author-name"><Link className="no-textdecoration" to={ `/user/${message.sender.username}` }>{ message.sender.username }</Link></span>
          <span class="chat-message-post-time">{ moment().to(moment(message.created_at)) }</span>
        </div>
        <div class="chat-message-content">
          { message.message }
        </div>
      </div>
    </li>
  )
}


export default Message