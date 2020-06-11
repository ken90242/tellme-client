// import Paper from './Menu';
import React from 'react';
import { Link } from "react-router-dom";
import { RiMessage3Line } from "react-icons/ri";

import moment from 'moment';

import './Notification.css'

class Notification extends React.Component {
  render() {
    return (
      <div className="popover-notification">
        <section className="notification-message">
            <div className="notification-message-left">
              <RiMessage3Line/>
            </div>
            <div className="notification-message-right">
              <span className="notification-message-author">
                <Link className="no-textdecoration" to={`/user/${this.props.notification.actor.username}`}>
                  { this.props.notification.actor.username }
                </Link>
              </span>
              &nbsp;
              <span className="notification-message-verb">{ this.props.notification.verb }</span>
              &nbsp;
              <span className="notification-message-content">
                <Link className="no-textdecoration" to={ this.props.notification.action_object_url }>
                  { this.props.notification.action_object }
                </Link>
              </span>
              &nbsp;
              <span className="notification-message-time">
              ({ moment().to(moment(this.props.notification.created_at)) })
              </span>
            </div>
        </section>
      </div>
    );
  }
}

export default Notification


