import React from 'react';

import './ChatAuthor.css';
import userDefaultImg from '../../static/img/default-user.png'


function getMessage(func) {
  func();
}

const ChatAuthor = ({ isMessaging, active, user, selectUserFunction }) => {
  return (
    <li className={`chat-auther ${ active === true ? 'chat-auther-active' : '' } ${ isMessaging === true ? 'blink' : '' }`} onClick={getMessage.bind(this, selectUserFunction)}>
      <div className="chat-author-img-wrapper">
        <img
          className="chat-author-img"
          alt="user"
          src={ user.picture ? user.picture.file : userDefaultImg } />
      </div>
      <span className="chat-author-name">{ user.username }</span>
    </li>
  )
}

export default ChatAuthor;
