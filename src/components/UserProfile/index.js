import React, { Fragment } from 'react';
import { RIEInput, RIETextArea, Loading } from 'riek'
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
import { host, getUser, updateUser } from '../../api/api'
import userDefaultImg from '../../static/img/default-user.png'

import { Message, Upload } from 'element-react';
import cookie from '../../static/js/cookie';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { job_title: "", email: "", location: "", introduction: "", picture: {} },
    };
  }

  dataChanged(attrs) {
    let userName = cookie.getCookie('username')

    if ('id' in this.props.match.params) {
      userName = this.props.match.params.id;
    }

    updateUser(userName, attrs)
    .then((response) => {
      getUser(userName)
      .then((response) => {
        this.setState({ user: response.data })
        Message.success({
          message: 'Successfully updated',
          customClass: 'element-message',
        });
      })
      .catch(console.log)
      // this.setState(prevState => Object.assign(prevState.user, response.data));
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

  handleAvatarScucess(upload_response, file) {
    let userName = cookie.getCookie('username')

    if ('id' in this.props.match.params) {
      userName = this.props.match.params.id;
    }

    updateUser(userName, { picture: upload_response.id })
    .then((response) => {
      getUser(userName)
      .then((response) => {
        this.setState({ user: response.data })
      })
      Message.success({
        message: 'Successfully updated',
        customClass: 'element-message',
      });
    })
    .catch(console.log);
    // this.setState({ imageUrl: URL.createObjectURL(file.raw) });
  }
  
  beforeAvatarUpload(file) {
    const isTYPE = ['image/jpeg', 'image/png'].includes(file.type);
    const isLt2M = file.size / 1024 / 1024 < 2;
  
    if (!isTYPE) {
      Message('Avatar picture must be JPG/PNG format!');
    }
    if (!isLt2M) {
      Message('Avatar picture size can not exceed 2MB!');
    }
    return isTYPE && isLt2M;
  }

  render() {
    // <span class="user-basic-info-item">{this.state.user.job_title}</span>
    const pic =(<div className="avatar-wrapper">
                  <img
                    alt="user"
                    src={this.state.user.picture ? this.state.user.picture.file : userDefaultImg }
                    className="avatar" />
                </div>);

    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <section class="user-profile-wrapper">
          <section class="user-up-section">
            {
              this.state.user.is_login_user === true ?
              <Upload
                action={`${host}/upload-user-picture/`}
                headers={{'X-CSRFToken': cookie.getCookie("csrftoken")}}
                name="file"
                showFileList={false}
                onSuccess={(res, file) => this.handleAvatarScucess(res, file)}
                beforeUpload={file => this.beforeAvatarUpload(file)}>
                <div className="avatar-wrapper">
                  <img alt="user" className="avatar"
                    src={this.state.user.picture ? this.state.user.picture.file : userDefaultImg }/>
                  <i className="el-icon-upload2 img__description"></i>
                </div>
              </Upload> :
              <Fragment>
                <div className="avatar-wrapper">
                  <img alt="user" className="avatar"
                    src={this.state.user.picture ? this.state.user.picture.file : userDefaultImg } />
                </div>
              </Fragment>
            }
            <div class="user-introduction">
              {
                this.state.user.is_login_user ?
                <RIETextArea
                  className="user-basic-info-item editable"
                  rows="8"
                  cols="60"
                  value={this.state.user.introduction ? this.state.user.introduction : "There is no introduction to this user"}
                  change={this.dataChanged.bind(this)}
                  propName='introduction'
                  validate={_.isString} /> :
                <span class="user-basic-info-item">{this.state.user.introduction}</span>
              }
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