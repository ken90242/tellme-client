import React, { Fragment } from 'react';

import { Dialog, Button, Breadcrumb, Tag, Input, Form, Message } from 'element-react';
import './login.css'
import { TMBreadcrumb } from '../Menu'
import { Link } from "react-router-dom";

import cookie from '../../static/js/cookie';

import { host, getJWTAuthenticatino, getUser, loginGithubOauth2 } from '../../api/api'

import githubLogo from '../../static/img/GitHub-Mark-Light-32px.png'
import facebookLogo from '../../static/img/Facebook-Mark-Light-58px.png'
import linkedinLogo from '../../static/img/Linkedin-Mark-Light.png'
import googleLogo from '../../static/img/Google-Mark-Light.png'
import redditLogo from '../../static/img/Reddit-Mark-Color.png'
import twitchLogo from '../../static/img/Twitch-Mark-Light.png'
import stackoverflowLogo from '../../static/img/Stackoverflow-Mark-Light.png'

import { connect } from 'react-redux'
import * as actionCreators from '../../actions'

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      form: {
        password: 'ttt',
        username: 'vistor',
      },
    };
  }

  componentDidMount() {

  }

  handleLogin(e) {
    e.preventDefault();
    try {
      getJWTAuthenticatino({ ...this.state.form })
      .then((response) => {
        cookie.setCookie('username', this.state.form.username, 7);
        cookie.setCookie('token', response.data.token, 7);
        getUser(cookie.getCookie('username'))
        .then((response) => {
          // Message.info({
          //   message: Object.keys(response.data).concat(Object.values(response.data)).join(' '),
          //   customClass: 'element-message',
          // });
          if (response.data.is_login_user) {
            this.props.loginUser({ user: response.data })
            Message.success({
              message: 'Successfully logged in',
              customClass: 'element-message',
            });
            this.props.history.push('/home')
          }
        })
        .catch(e => {
          let err_msg = "Unknown Error";
          if (e.constructor === Object &&
            'non_field_errors' in e &&
            e.non_field_errors.length > 0) {
            err_msg = e.non_field_errors[0];
          }
          Message.error({
            message: `${err_msg}`,
            customClass: 'element-message',
          });
        })
      })
      .catch(e => {
        let err_msg = "Unknown Error";
        if (e.constructor === Object &&
            'non_field_errors' in e &&
            e.non_field_errors.length > 0) {
          err_msg = e.non_field_errors[0];
        }
        Message.error({
          message: `${err_msg}`,
          customClass: 'element-message',
        });
      })
    } catch (err) {
      Message.info({
        message: err,
        customClass: 'element-message',
      });
    }
  }

  handleRegister(e) {
    e.preventDefault();
  }

  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
  }

  render() {
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <section className="external-wrapper">
          <div className="form-wrapper">
            <Form ref="form" model={this.state.form} labelWidth="100" className="loginForm">
              <Form.Item label="User Name" prop="username">
                <Input type="text" value={this.state.form.username} onChange={this.onChange.bind(this, 'username')} autoComplete="off" />
              </Form.Item>
              <Form.Item label="Password" prop="password">
                <Input type="password" value={this.state.form.password} onChange={this.onChange.bind(this, 'password')} autoComplete="off" />
              </Form.Item>
              <div className="form-footer">
                <Button className="" type="primary" onClick={this.handleLogin.bind(this)}>Login</Button>
              </div>
            </Form>
          </div>
          <div className="thirdparty-form-wrapper">
            {/* <div className="login_3rdparty_button facebook">
              <div className="logo-wrapper"><img src={facebookLogo} alt="facebook"/></div>
              <span>Login with Facebook</span>
            </div> */}
            {/* <div className="login_3rdparty_button google">
              <div className="logo-wrapper"><img src={googleLogo} alt="google"/></div>
              <span>Login with Google</span>
            </div> */}
            <a className="login_3rdparty_button reddit" href={`${host}/login/reddit/`}>
              <div className="logo-wrapper"><img src={redditLogo} alt="reddit"/></div>
              <span>Login with Reddit</span>
            </a>
            <a className="login_3rdparty_button stackoverflow" href={`${host}/login/stackoverflow/`}>
              <div className="logo-wrapper"><img src={stackoverflowLogo} alt="stackoverflow"/></div>
              <span>Login with <span className="stack">stack</span><strong className="overlow">overflow</strong></span>
            </a>
            <a className="login_3rdparty_button github" href={`${host}/login/github/`}>
              <div className="logo-wrapper"><img src={githubLogo} alt="github"/></div>
              <span>Login with GitHub</span>
            </a>
            <a className="login_3rdparty_button twitch"  href={`${host}/login/twitch/`}>
              <div className="logo-wrapper"><img src={twitchLogo} alt="twitch"/></div>
              <span>Login with Twitch</span>
            </a>
            {/* <div className="login_3rdparty_button linkedin">
              <div className="logo-wrapper"><img src={linkedinLogo} alt="linkedin"/></div>
              <span>Login with Linkedin</span>
            </div> */}
          </div>
        </section>
      </Fragment>
    )
  }
}


const mapStateToProps = store => (
  { currentUser: store.currentUser }
)

export default connect(mapStateToProps, actionCreators)(LoginRegister);
