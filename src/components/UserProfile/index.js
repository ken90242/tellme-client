import React, { Fragment } from 'react';
import { RIEInput, RIETextArea } from 'riek'
import _ from 'lodash'

import { TMBreadcrumb } from '../Menu'
import './UserProfile.css';

import { FaUserCircle } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { MdFeaturedPlayList } from 'react-icons/md';
import { TiLocation } from 'react-icons/ti';
import { DiCode } from 'react-icons/di';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { GoComment } from 'react-icons/go';
import { GrArticle } from 'react-icons/gr';
import { BsQuestionCircle } from 'react-icons/bs';
import { AiOutlineInteraction } from 'react-icons/ai';
import { getUser, updateUser } from '../../api/api'

import { Message } from 'element-react';
import cookie from '../../static/js/cookie';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { job_title: "", email: "", location: "" },
      fake_intro: "什么是慕课（MOOC）？ 源于国外，Massive（大规模）Open（开放）Online（在线）Course（课程）。 慕课网是什么MOOC？ 专注做好IT技能教育的MOOC，符合互联网发展潮流接地气儿的MOOC。我们免费，我们只教有用的",
    };
  }

  dataChanged(attrs) {
    let userName = cookie.getCookie('username')

    if ('id' in this.props.match.params) {
      userName = this.props.match.params.id;
    }

    updateUser(userName, attrs)
    .then((response) => {
      this.setState(prevState => Object.assign(prevState.user, response.data));
      Message.success({
        message: 'Successfully updated',
        customClass: 'element-message',
      });
    })
    .catch(console.log);
  }

  componentDidMount() {
    let userName = cookie.getCookie('username')

    if ('id' in this.props.match.params) {
      userName = this.props.match.params.id;
    }

    getUser(userName)
    .then((response) => {
      console.log(response);
      this.setState({ user: response.data })
    })
    .catch(console.log)
  }

  render() {
    // <span class="user-basic-info-item">{this.state.user.job_title}</span>
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <section class="user-profile-wrapper">
          <section class="user-up-section">
            <img class="user-img" alt="user" src="http://img.liaogx.com/media%2Fcache%2F29%2F21%2F2921e284c72c34f3a67f39c07980919f.jpg"/>
            <div class="user-introduction">
              <RIETextArea
                  className="user-basic-info-item editable"
                  rows="8"
                  cols="60"
                  value={this.state.fake_intro}
                  change={this.dataChanged.bind(this)}
                  propName='introduction'
                  validate={_.isString} />
            </div>
            <div class="user-basic-info">
              <div class="user-basic-info-item">
                <FaUserCircle className="user-basic-info-item-icon"/>
                <span class="user-basic-info-item">{this.state.user.username}</span>
              </div>
              <div class="user-basic-info-item">
                <IoMdMail className="user-basic-info-item-icon"/>
                {
                  this.state.user.is_login_user ?
                  <RIEInput
                  className="user-basic-info-item editable"
                  value={this.state.user.email}
                  change={this.dataChanged.bind(this)}
                  propName='email'
                  validate={_.isString} /> :
                  <span class="user-basic-info-item">{this.state.user.email}</span>
                }
              </div>
              <div class="user-basic-info-item">
                <MdFeaturedPlayList className="user-basic-info-item-icon"/>
                {
                  this.state.user.is_login_user ?
                  <RIEInput
                  className="user-basic-info-item editable"
                  value={this.state.user.job_title}
                  change={this.dataChanged.bind(this)}
                  propName='job_title'
                  validate={_.isString} /> :
                  <span class="user-basic-info-item">{this.state.user.job_title}</span>
                }
              </div>
              <div class="user-basic-info-item">
                <TiLocation className="user-basic-info-item-icon"/>
                {
                  this.state.user.is_login_user ?
                  <RIEInput
                  className="user-basic-info-item editable"
                  value={this.state.user.location}
                  change={this.dataChanged.bind(this)}
                  propName='location'
                  validate={_.isString} /> :
                  <span class="user-basic-info-item">{this.state.user.location}</span>
                }
              </div>
            </div>
          </section>
          <section class="user-down-section">
            <div class="user-statistic-block">
              <div class="user-statistic-header">
                <DiCode className="user-statistic-icon"/>
                <span class="user-statistic-name">Tweets</span>
              </div>
              <div class="user-statistic-number">{this.state.user.moments_num}</div>
            </div>
            <hr/>
            <div class="user-statistic-block">
              <div class="user-statistic-header">
                <GrArticle className="user-statistic-icon"/>
                <span class="user-statistic-name">Articles</span>
              </div>
              <div class="user-statistic-number">{this.state.user.article_num}</div>
            </div>
            <hr/>
            <div class="user-statistic-block">
              <div class="user-statistic-header">
                <GoComment className="user-statistic-icon"/>
                <span class="user-statistic-name">Comments</span>
              </div>
              <div class="user-statistic-number">{this.state.user.comment_num}</div>
            </div>
            <hr/>
            <div class="user-statistic-block">
              <div class="user-statistic-header">
                <BsQuestionCircle className="user-statistic-icon"/>
                <span class="user-statistic-name">Questions</span>
              </div>
              <div class="user-statistic-number">{this.state.user.question_num}</div>
            </div>
            <hr/>
            <div class="user-statistic-block">
              <div class="user-statistic-header">
                <RiQuestionAnswerLine className="user-statistic-icon"/>
                <span class="user-statistic-name">Answers</span>
              </div>
              <div class="user-statistic-number">{this.state.user.answer_num}</div>
            </div>
            <hr/>
            <div class="user-statistic-block">
              <div class="user-statistic-header">
                <AiOutlineInteraction className="user-statistic-icon"/>
                <span class="user-statistic-name">Interactions</span>
              </div>
              <div class="user-statistic-number">{this.state.user.interaction_num}</div>
            </div>
          </section>
        </section>
      </Fragment>
    )
  }
}


export default UserProfile