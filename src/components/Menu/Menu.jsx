// import Paper from './Menu';
import React, { Fragment } from 'react';
import { Badge, Breadcrumb, Menu, Input, Button, Dropdown, Popover, Table, Message } from 'element-react';
import { BsBellFill, BsBell } from "react-icons/bs";
import { GiExitDoor } from "react-icons/gi";
import { AiFillSetting } from "react-icons/ai";
import { MdHome, MdQuestionAnswer } from "react-icons/md";
import { IoMdPaper } from "react-icons/io";
import { FaFacebookMessenger } from "react-icons/fa"
import { Link } from "react-router-dom";
import { RiMessage3Line } from "react-icons/ri";
import Notification from './Notification';
import { withRouter } from 'react-router-dom';

import './Menu.css'
import { matchRoutes } from 'react-router-config';
import routes from '../../router';
import { getNotifications, deleteNotification, updateNotification } from '../../api/api'
import cookie from '../../static/js/cookie';

import websocket from '../../api/websocket'

import { connect } from 'react-redux'
import * as actionCreators from '../../actions'


class TopMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchKeyWord: '',
      activeTab: '1',
    }
  }

  onSearch() {
    if (this.state.searchKeyWord.trim() !== "") {
      this.props.history.push(`/search/${this.state.searchKeyWord.trim()}`);
    }
    this.updateInputValue("");
  }

  updateInputValue(value) {
    this.setState({ searchKeyWord: value });
  }

  logout() {
    cookie.delCookie('username');
    cookie.delCookie('token');
    this.props.logoutUser({});
    this.props.history.replace('/login');
  }

  dimiss_notifications() {
    const remains = this.props.notificationList.filter(notification => {
      updateNotification(notification.uuid_id, { unread: false })
      .then((response) => {
         return false;
      })
      .catch(err => {
        console.log(err);
        return true;
      });
    });
    this.props.updateNotificationList({ notificationList: remains });
    Message.success({
      message: 'All cleared',
      customClass: 'element-message',
    });

  }

  componentDidMount() {
    const { pathname } = this.props.history.location;
    if (pathname.includes('/article') || pathname.includes('/draft')) {
      this.state.activeTab = '2'
    } else if (pathname.includes('/qa')) {
      this.state.activeTab = '3'
    } else if (pathname.includes('/messenger')) {
      this.state.activeTab = '4'
    } else if (pathname.includes('/home') || pathname.includes('/news')) {
      this.state.activeTab = '1'
    }

    const ws = websocket({ channel_name: 'notifications', token: cookie.getCookie('token') });

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.notification) {
        this.props.addNotification({ notification: payload.notification });
      }
    }

    getNotifications()
    .then((response) => {
      this.props.updateNotificationList({ notificationList: response.data });
    })
    .catch(console.log)
  }

  render() {
    let notification_buttons;

    if (this.props.notificationList.length > 0) {
      notification_buttons = (
        <section className="popover-notification-buttons">
          <Button type="danger" onClick={ this.dimiss_notifications.bind(this) }>Dismiss all</Button>
        </section>
      )
    }

    return (
      <div className="menu-wrapper">
        <div className="left-menu">
          <span className="index-link"><img id="logo" src="/TellMe.png"/></span>
          <Menu defaultActive={this.state.activeTab} className="el-menu-demo" mode="horizontal">
            <Menu.Item index="1"><Link to="/home"><MdHome/>&nbsp;Home</Link></Menu.Item>
            <Menu.Item index="2"><Link to="/article"><IoMdPaper/>&nbsp;Article</Link></Menu.Item>
            <Menu.Item index="3"><Link to="/qa"><MdQuestionAnswer/>&nbsp;Q&A</Link></Menu.Item>
            <Menu.Item index="4"><Link to="/messenger"><FaFacebookMessenger/>&nbsp;Messenger</Link></Menu.Item>
          </Menu>
        </div>
        { Object.keys(this.props.currentUser).length === 0 ? "" :
          <div className="right-menu">
            <Popover className="native-popover-notification" placement="bottom" width="400" trigger="click" content={(
              <Fragment>
                <div className="notification-area-title">Notification</div>
                <section className="popover-notification-list">
                  {
                    this.props.notificationList.length > 0 ?
                    this.props.notificationList.map((notification, i) => <Notification key={i} notification={notification} />):
                    (<Fragment>
                      <div className="empty-notification-list">Empty</div>
                    </Fragment>)
                  }
                </section>
                { notification_buttons }
              </Fragment>
            )}>
              <div className="notification-area">
              {
                this.props.notificationList.length > 0 ?
                (<Badge value={ this.props.notificationList.length }>
                  <BsBellFill size="20"/>
                </Badge>) :
                (<BsBell size="20"/>)
              }
              </div>
            </Popover>
            <div className="global-search">
              <Input
                placeholder="Search TellMe"
                value={this.state.searchKeyWord}
                onChange={value => this.updateInputValue(value)}
                append={<Button icon="search" onClick={this.onSearch.bind(this)}></Button>}
              />
            </div>
            <div className="profile-area">
              <img className="head-img" src="https://shop.line-scdn.net/themeshop/v1/products/d5/46/a2/d546a2d4-27a8-48d7-8bf4-ad88815e8c75/17/WEBSTORE/icon_198x278.png"></img>
              <Popover className="popover-dropdown-menu-wrapper" placement="bottom" width="80" trigger="hover" content={(
                <Fragment>
                  <section className="popover-dropdown-menu">
                    {
                      <Fragment>
                        <ul>
                          <Link to="/settings">
                            <li className="dropdown-item">
                              <div className="no-textdecoration">
                                <AiFillSetting size="15"/>&nbsp;&nbsp;Setting
                              </div>
                            </li>
                          </Link>
                          <li className="dropdown-item">
                            <div onClick={this.logout.bind(this)}>
                              <GiExitDoor/>&nbsp;&nbsp;Logout
                            </div>
                          </li>
                        </ul>
                      </Fragment>
                    }
                  </section>
                </Fragment>
              )}>
                <div className="user-menu-area">
                  { this.props.currentUser.username }<i className="el-icon-arrow-down el-icon--right"/>
                </div>
              </Popover>
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = store => (
  { currentUser: store.currentUser, notificationList: store.notificationList }
)

export default connect(mapStateToProps, actionCreators)(TopMenu)

