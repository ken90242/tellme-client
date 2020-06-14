import React, { Fragment } from 'react';

import { Input } from 'element-react';

import { TMBreadcrumb } from '../Menu'
import './Messenger.css';

import Message from './Message'
import ChatAuthor from './ChatAuthor'

import $ from "jquery";
import { getUsers, getMessageWithUser } from '../../api/api'
import moment from 'moment';

import cookie from '../../static/js/cookie';
import websocket from '../../api/websocket'


class Messenger extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      users: [],
      usersIsActive: [],
      userMessages: [],
      activeUser: null,
      usersIsMessaging: [],
      websocketInstance: null,
      form: {
        inputMessage: '',
      }
    };
  }

  updateInputValue(value) {
    this.setState({form: {inputMessage: value}});
  }

  scrollConversationScreen() {
      // $("input[name='message']").focus();
      // $('.chat-message-list').scrollTop($('.chat-message-list').scrollHeight);
  }

  setup_ws() {
    const websocketInstance = websocket({ channel_name: cookie.getCookie("username"), token: cookie.getCookie('token') });

    // 监听后端发送过来的消息
    websocketInstance.onmessage = (event) => {
      if (event.data === 'connected') {
        console.log(`messenger ${event.data}`);
        return;
      }
      const payload = JSON.parse(event.data);

      if (payload.message.sender.username === this.state.activeUser) {  // 发送者为当前选中的用户
        this.setState(prevState => {
          const userMessages = prevState.userMessages
          userMessages.push(payload.message);
          return { userMessages };
        });
        // this.scrollConversationScreen();  // 滚动条下拉到底
      } else {
        const i = this.state.users.findIndex(user => user.username === payload.message.sender.username)
        this.setState(prevState => {
          const usersIsMessaging = prevState.usersIsMessaging;
          usersIsMessaging[i] = true;
          return { usersIsMessaging }
        });
      }
    }

    this.setState({ websocketInstance });
  }

  sendMessage(event) {
    if (event.keyCode === 13) {
      const messageSerailizerdObj = JSON.stringify({
        recipientName: this.state.activeUser,
        message: this.state.form.inputMessage
      });

      this.state.websocketInstance.send(messageSerailizerdObj);
      this.updateInputValue("");
      this.setState(prevState => {
        const userMessages = prevState.userMessages;
        userMessages.push({
          sender: { username: cookie.getCookie("username") },
          message: this.state.form.inputMessage,
          created_at: moment(),
        });
        return { userMessages }
      });
    }
  }

  componentDidMount() {
    getUsers()
    .then((response) => {
      this.setState({
        users: response.data,
        usersIsActive: response.data.map(obj => false),
        usersIsMessaging: response.data.map(obj => false),
      })
      this.setup_ws();
    })
    .catch(console.log)
  }

  updateMessage(i) {
    this.setState(prevState => {
      const usersIsActive = prevState.usersIsActive.map(obj => false);
      usersIsActive[i] = true;
      const usersIsMessaging = prevState.usersIsMessaging;
      usersIsMessaging[i] = false;
      return { usersIsActive, usersIsMessaging };
    });
    getMessageWithUser(this.state.users[i].username)
    .then((response) => {
      this.setState({ userMessages: response.data, activeUser: this.state.users[i].username});
    })
    .catch(console.log)
  }

  render() {
    let messenger_block;

    if (this.state.usersIsActive.some(v => v === true)) {
      messenger_block = 
        (
          <section className="messenger-right-block">
            { 
              this.state.userMessages.length === 0 ? 
                <span style={{ marginTop: '5%', color: 'grey' }}>No message here</span> : 
                <ul className="chat-message-list">
                  { this.state.userMessages.map((message, i) => <Message className=".messages-list" key={i} message={message}/> ) }
                </ul>
            }
            <Input
              className="chat-input-message"
              placeholder="Input message"
              onChange={value => this.updateInputValue(value)}
              onKeyUp={this.sendMessage.bind(this)}
              value={this.state.form.inputMessage}
            />
          </section>
        );
    }

    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <div className="messenger-wrapper">
          <section className="messenger-left-block">
            <ul className="chat-auther-list">
              { this.state.users.map((user, i) => 
                  <ChatAuthor
                    key={i}
                    isMessaging={this.state.usersIsMessaging[i]}
                    active={this.state.usersIsActive[i]}
                    user={user}
                    selectUserFunction={this.updateMessage.bind(this, i)}
                  />
                )
              }
            </ul>
          </section>
          { messenger_block }
        </div>
      </Fragment>
    )
  }
}


export default Messenger