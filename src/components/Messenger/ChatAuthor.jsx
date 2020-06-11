import React from 'react';

import './ChatAuthor.css';



function getMessage(func) {
  func();
}

const ChatAuthor = ({ isMessaging, active, user, selectUserFunction }) => {
  return (
    <li className={`chat-auther ${ active === true ? 'chat-auther-active' : '' } ${ isMessaging === true ? 'blink' : '' }`} onClick={getMessage.bind(this, selectUserFunction)}>
      <div className="chat-author-img-wrapper">
        <img className="chat-author-img" alt="user" src="https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Harvard_shield_wreath.svg/180px-Harvard_shield_wreath.svg.png"/>
      </div>
      <span className="chat-author-name">{ user.username }</span>
    </li>
  )
}

export default ChatAuthor;
